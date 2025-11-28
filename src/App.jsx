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
} from './utils/storage';

function App() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

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

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // 顯示 Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 保存 Session
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const newSession = await saveSession();
      if (newSession) {
        setSessions((prev) => [newSession, ...prev]);
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
    setConfirmDialog({
      isOpen: true,
      title: t('dialog.deleteTitle'),
      message: t('dialog.deleteMessage'),
      onConfirm: async () => {
        const success = await deleteSession(sessionId);
        if (success) {
          setSessions((prev) => prev.filter((s) => s.id !== sessionId));
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
      onConfirm: async () => {
        const success = await clearAllSessions();
        if (success) {
          setSessions([]);
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
    setConfirmDialog({
      isOpen: true,
      title: t('dialog.updateTitle'),
      message: t('dialog.updateMessage', { name: session.name }),
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
    <div className="w-[400px] h-[500px] bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">{t('app.title')}</h1>
              <p className="text-xs text-gray-500">{t('app.subtitle')}</p>
            </div>
          </div>
          
          {/* 保存按鈕 */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${isSaving 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg active:scale-95'
              }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('header.saving')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {t('header.saveButton')}
              </>
            )}
          </button>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <SessionList
            sessions={sessions}
            onRestore={handleRestore}
            onDelete={handleDelete}
            onOpenTab={handleOpenTab}
            onRestoreWindow={handleRestoreWindow}
            onUpdateSession={handleUpdateSession}
            onClearAll={handleClearAll}
            onOverwrite={handleOverwrite}
            onDeleteWindow={handleDeleteWindow}
          />
        )}
      </main>

      {/* Banner 區塊 */}
      <footer className="flex-shrink-0 px-3 pb-3">
        {/* 匯出/匯入按鈕 */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleExport}
            disabled={sessions.length === 0}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={t('export.title')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {t('export.button')}
          </button>
          <button
            onClick={handleImportClick}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
        <Banner />
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
