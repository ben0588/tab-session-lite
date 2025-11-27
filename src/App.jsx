import { useState, useEffect, useCallback } from 'react';
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
  formatDateTime,
} from './utils/storage';

function App() {
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
    } catch (error) {
      showToast('載入失敗', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        showToast(`已保存 ${newSession.totalTabs} 個分頁`);
      } else {
        showToast('沒有可保存的分頁', 'info');
      }
    } catch (error) {
      showToast('保存失敗', 'error');
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
      showToast('更新失敗', 'error');
    }
  };

  // 刪除 Session
  const handleDelete = async (sessionId) => {
    setConfirmDialog({
      isOpen: true,
      title: '刪除確認',
      message: '確定要刪除這個 Session 嗎？此操作無法復原。',
      onConfirm: async () => {
        const success = await deleteSession(sessionId);
        if (success) {
          setSessions((prev) => prev.filter((s) => s.id !== sessionId));
          showToast('已刪除');
        } else {
          showToast('刪除失敗', 'error');
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
      title: '清空全部',
      message: `確定要清空所有 ${sessions.length} 個 Session 嗎？此操作無法復原。`,
      onConfirm: async () => {
        const success = await clearAllSessions();
        if (success) {
          setSessions([]);
          showToast('已清空所有紀錄');
        } else {
          showToast('清空失敗', 'error');
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
      showToast(`已恢復 ${session.totalTabs} 個分頁`);
    } catch (error) {
      showToast('恢復失敗', 'error');
    }
  };

  // 開啟單一分頁
  const handleOpenTab = async (url) => {
    try {
      await openSingleTab(url);
    } catch (error) {
      showToast('開啟分頁失敗', 'error');
    }
  };

  // 恢復單一視窗
  const handleRestoreWindow = async (windowData) => {
    try {
      await restoreWindow(windowData);
      showToast(`已恢復 ${windowData.tabs.length} 個分頁`);
    } catch (error) {
      showToast('恢復視窗失敗', 'error');
    }
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
              <h1 className="text-sm font-bold text-gray-900">Tab Session Lite</h1>
              <p className="text-xs text-gray-500">Instant Save, Local Only</p>
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
                保存中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                立即保存
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
          />
        )}
      </main>

      {/* Banner 區塊 */}
      <footer className="flex-shrink-0 px-3 pb-3">
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
      />
    </div>
  );
}

export default App;
