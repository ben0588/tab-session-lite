import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SessionList from './components/SessionList';
import Toast from './components/Toast';
import Banner from './components/Banner';
import ConfirmDialog from './components/ConfirmDialog';
import {
  loadSessions,
  saveSession,
  deleteSession,
  clearAllSessions,
  restoreSession,
  restoreWindow,
  openSingleTab,
  updateSession,
  overwriteSession,
  exportSessions,
  importSessions,
  formatDateTime,
  getSessionDisplayName,
  loadDeletedSessions,
  restoreFromDeletedSession,
  getTheme,
  saveTheme,
} from './utils/storage';

function App() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [deletedSessions, setDeletedSessions] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [theme, setTheme] = useState('light');
  const toastTimerRef = useRef(null);

  // 元件卸載時清理 Toast 計時器
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // 初始化載入主題
  useEffect(() => {
    getTheme().then((savedTheme) => {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  // 切換主題
  const handleToggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    await saveTheme(nextTheme);
  };

  // 載入 Sessions
  const fetchSessions = useCallback(async () => {
    try {
      const data = await loadSessions();
      setSessions(data);
    } catch (_error) {
      showToast(t('toast.loadFailed'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // 載入最近刪除的 Sessions
  const fetchDeletedSessions = useCallback(async () => {
    try {
      const data = await loadDeletedSessions();
      setDeletedSessions(data);
    } catch (_error) {
      // 靜默失敗
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchDeletedSessions();
  }, [fetchSessions, fetchDeletedSessions]);

  // 顯示 Toast (語意分級時間：一般 1.8 秒，錯誤 3 秒；定時器防抖清理)
  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    const duration = type === 'error' ? 3000 : 1800;
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, duration);
  }, []);

  // 保存 Session
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const newSession = await saveSession();
      if (newSession) {
        setSessions((prev) => [newSession, ...prev]);
        setShowDeleted(false);
        showToast(t('toast.saved', { count: newSession.totalTabs }));
      } else {
        showToast(t('toast.noTabs'), 'info');
      }
    } catch (_error) {
      showToast(t('toast.saveFailed'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 更新 Session（編輯名稱或刪除分頁）
  const handleUpdateSession = async (updatedSession) => {
    // 如果沒有任何分頁了，刪除整個 Session
    if (updatedSession.windows.length === 0) {
      handleDelete(updatedSession.id);
      return;
    }

    const success = await updateSession(updatedSession);
    if (success) {
      setSessions((prev) => 
        prev.map((s) => s.id === updatedSession.id ? updatedSession : s)
      );
    } else {
      showToast(t('toast.updateFailed'), 'error');
    }
  };

  // 刪除 Session
  const handleDelete = async (sessionId) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    const displayName = getSessionDisplayName(targetSession, t('sessionItem.recordPrefix', '紀錄'));

    setConfirmDialog({
      isOpen: true,
      title: t('dialog.deleteTitle'),
      message: t('dialog.deleteMessage', { name: displayName }),
      onConfirm: async () => {
        const success = await deleteSession(sessionId);
        if (success) {
          setSessions((prev) => prev.filter((s) => s.id !== sessionId));
          await fetchDeletedSessions();
          showToast(t('toast.deleted'));
        } else {
          showToast(t('toast.deleteFailed'), 'error');
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false }),
    });
  };

  // 清空所有 Sessions
  const handleClearAll = () => {
    if (sessions.length === 0) return;
    
    setConfirmDialog({
      isOpen: true,
      title: t('dialog.clearAllTitle'),
      message: t('dialog.clearAllMessage', { count: sessions.length }),
      confirmText: t('dialog.moveToTrash'),
      onConfirm: async () => {
        const success = await clearAllSessions();
        if (success) {
          setSessions([]);
          await fetchDeletedSessions();
          showToast(t('toast.clearedAll'));
        } else {
          showToast(t('toast.clearFailed'), 'error');
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false }),
    });
  };

  // 恢復 Session
  const handleRestore = async (session) => {
    try {
      await restoreSession(session);
      showToast(t('toast.restored', { count: session.totalTabs }));
    } catch (_error) {
      showToast(t('toast.restoreFailed'), 'error');
    }
  };

  // 開啟單一分頁
  const handleOpenTab = async (url) => {
    try {
      await openSingleTab(url);
    } catch (_error) {
      showToast(t('toast.openTabFailed'), 'error');
    }
  };

  // 恢復單一視窗
  const handleRestoreWindow = async (windowData) => {
    try {
      await restoreWindow(windowData);
      showToast(t('toast.restored', { count: windowData.tabs.length }));
    } catch (_error) {
      showToast(t('toast.restoreWindowFailed'), 'error');
    }
  };

  // 覆蓋更新 Session (用目前分頁覆蓋現有紀錄)
  const handleOverwrite = (session) => {
    const displayName = getSessionDisplayName(session, t('sessionItem.recordPrefix', '紀錄'));

    setConfirmDialog({
      isOpen: true,
      title: t('dialog.updateTitle'),
      message: t('dialog.updateMessage', { name: displayName }),
      onConfirm: async () => {
        try {
          const updatedSession = await overwriteSession(session.id, session.name);
          if (updatedSession) {
            setSessions((prev) =>
              prev.map((s) => (s.id === session.id ? updatedSession : s))
            );
            showToast(t('toast.updated', { count: updatedSession.totalTabs }));
          } else {
            showToast(t('toast.noTabsIncognito'), 'info');
          }
        } catch (_error) {
          showToast(t('toast.updateFailed'), 'error');
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false }),
    });
  };

  // 刪除整個視窗
  const handleDeleteWindow = (sessionId, windowIndex) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const windowData = session.windows[windowIndex];
    const tabCount = windowData?.tabs?.length || 0;

    setConfirmDialog({
      isOpen: true,
      title: t('dialog.deleteWindowTitle'),
      message: t('dialog.deleteWindowMessage', { count: tabCount }),
      onConfirm: async () => {
        const newWindows = session.windows.filter((_, idx) => idx !== windowIndex);
        const updatedSession = {
          ...session,
          windows: newWindows,
          totalTabs: newWindows.reduce((sum, w) => sum + w.tabs.length, 0),
        };
        
        // 如果刪除後沒有視窗了，刪除整個 Session
        if (newWindows.length === 0) {
          const success = await deleteSession(sessionId);
          if (success) {
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            await fetchDeletedSessions();
            showToast(t('toast.recordDeleted'));
          } else {
            showToast(t('toast.deleteFailed'), 'error');
          }
        } else {
          const success = await updateSession(updatedSession);
          if (success) {
            setSessions((prev) =>
              prev.map((s) => (s.id === sessionId ? updatedSession : s))
            );
            showToast(t('toast.windowDeleted'));
          } else {
            showToast(t('toast.deleteFailed'), 'error');
          }
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false }),
    });
  };

  // 從最近刪除清單還原 Session
  const handleRestoreFromDeleted = async (session) => {
    const restored = await restoreFromDeletedSession(session.id);
    if (restored) {
      setDeletedSessions((prev) => prev.filter((s) => s.id !== session.id));
      setSessions((prev) => [restored, ...prev]);
      showToast(t('toast.restoredFromDeleted'));
    } else {
      showToast(t('toast.restoreFromDeletedFailed'), 'error');
    }
  };

  // 匯出所有 Sessions 為 JSON
  const handleExport = async () => {
    try {
      const jsonString = await exportSessions();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tab-sessions-${formatDateTime(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t('toast.exported'));
    } catch (_error) {
      showToast(t('toast.exportFailed'), 'error');
    }
  };

  // 匯入 Sessions
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      // 先解析 JSON 確認有效
      let parsedData;
      try {
        parsedData = JSON.parse(text);
        if (!parsedData.sessions || !Array.isArray(parsedData.sessions)) {
          showToast(t('toast.invalidJson'), 'error');
          e.target.value = '';
          return;
        }
      } catch {
        showToast(t('toast.invalidJsonFile'), 'error');
        e.target.value = '';
        return;
      }

      const importCount = parsedData.sessions.length;
      
      // 詢問匯入方式
      setConfirmDialog({
        isOpen: true,
        title: t('import.dialogTitle'),
        message: t('import.dialogMessage', { count: importCount }),
        confirmText: t('import.mergeButton'),
        cancelText: t('import.replaceButton'),
        type: 'info',
        onConfirm: async () => {
          // 合併模式：保留現有 + 新增匯入的
          const result = await importSessions(text, false);
          if (result.success) {
            await fetchSessions();
            if (result.imported === 0) {
              showToast(t('toast.noNewRecords'), 'info');
            } else {
              showToast(t('toast.imported', { count: result.imported }));
            }
          } else {
            showToast(result.error || t('toast.importFailed'), 'error');
          }
          setConfirmDialog({ isOpen: false });
        },
        onCancel: async () => {
          // 再次確認是否真的要取代
          setConfirmDialog({
            isOpen: true,
            title: t('import.confirmReplaceTitle'),
            message: t('import.confirmReplaceMessage'),
            confirmText: t('import.confirmReplaceButton'),
            cancelText: t('dialog.cancel'),
            type: 'danger',
            onConfirm: async () => {
              const result = await importSessions(text, true);
              if (result.success) {
                await fetchSessions();
                showToast(t('toast.importedReplaced', { count: result.imported }));
              } else {
                showToast(result.error || t('toast.importFailed'), 'error');
              }
              setConfirmDialog({ isOpen: false });
            },
            onCancel: () => setConfirmDialog({ isOpen: false }),
          });
        },
      });
    } catch (_error) {
      showToast(t('toast.readFileFailed'), 'error');
    }
    
    // 重設 input 以便再次選擇同一檔案
    e.target.value = '';
  };

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-canvas text-gray-900 dark:text-ink flex flex-col font-sans select-none overflow-hidden transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-surface/90 shadow-sm border-b border-gray-100 dark:border-hairline px-4 py-3 flex-shrink-0 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* 經典藍紫漸層 Logo */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-ink tracking-tight">{t('app.title')}</h1>
              <p className="text-xs text-gray-500 dark:text-mute">{t('app.subtitle')}</p>
            </div>
          </div>
          
          {/* 右側操作按鈕區 (唯一 Primary CTA: 立即保存按鈕) */}
          <div className="flex items-center">
            {/* 保存按鈕 - 經典藍紫高對比漸層按鈕 */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs transition-all shadow-sm
                ${isSaving 
                  ? 'bg-gray-300 dark:bg-stone text-gray-500 dark:text-ash cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow hover:shadow-md active:scale-95'
                }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('header.saving')}
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {t('header.saveButton')}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="flex-1 overflow-y-auto p-3 bg-gray-100 dark:bg-canvas transition-colors">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin w-6 h-6 text-blue-500 dark:text-mute" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <SessionList
            sessions={sessions}
            deletedSessions={deletedSessions}
            showDeleted={showDeleted}
            onToggleDeleted={() => setShowDeleted((v) => !v)}
            onRestore={handleRestore}
            onDelete={handleDelete}
            onOpenTab={handleOpenTab}
            onRestoreWindow={handleRestoreWindow}
            onUpdateSession={handleUpdateSession}
            onClearAll={handleClearAll}
            onOverwrite={handleOverwrite}
            onDeleteWindow={handleDeleteWindow}
            onRestoreFromDeleted={handleRestoreFromDeleted}
          />
        )}
      </main>

      {/* Banner 區塊 */}
      <footer className="flex-shrink-0 px-3 pb-2.5 bg-gray-100 dark:bg-canvas transition-colors">
        {/* 匯出/匯入按鈕 */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleExport}
            disabled={sessions.length === 0}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-mute hover:text-gray-900 dark:hover:text-ink bg-white dark:bg-surface-card hover:bg-gray-50 dark:hover:bg-surface-elevated border border-gray-300 dark:border-hairline rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            title={t('export.title')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {t('export.button')}
          </button>
          <button
            onClick={handleImportClick}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-mute hover:text-gray-900 dark:hover:text-ink bg-white dark:bg-surface-card hover:bg-gray-50 dark:hover:bg-surface-elevated border border-gray-300 dark:border-hairline rounded-lg transition-all shadow-sm"
            title={t('import.title')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('import.button')}
          </button>
          {/* 隱藏的 file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
        <Banner onShowToast={showToast} theme={theme} onToggleTheme={handleToggleTheme} />
      </footer>

      {/* Toast 通知 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* 確認對話框 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
      />
    </div>
  );
}

export default App;
