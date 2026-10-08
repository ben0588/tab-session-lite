import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTime, getSessionDisplayName } from '../utils/storage';

// 分頁群組顏色對應
const GROUP_COLORS = {
  grey: '#5F6368',
  blue: '#1A73E8',
  red: '#D93025',
  yellow: '#F9AB00',
  green: '#188038',
  pink: '#D01884',
  purple: '#A142F4',
  cyan: '#007B83',
  orange: '#E8710A',
};

/**
 * SessionItem 元件 - 顯示單一 Session 項目 (支援雙主題)
 */
export default function SessionItem({ 
  session, 
  isDeleted = false,
  onRestoreFromDeleted,
  onRestore, 
  onDelete, 
  onOpenTab, 
  onRestoreWindow, 
  onUpdateSession, 
  onOverwrite, 
  onDeleteWindow, 
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const displayName = getSessionDisplayName(session, t('sessionItem.recordPrefix', '紀錄'));
  const [editName, setEditName] = useState(displayName);

  // 保存名稱
  const handleSaveName = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== displayName) {
      onUpdateSession({ ...session, name: trimmed });
    } else if (!trimmed) {
      onUpdateSession({ ...session, name: '' });
    }
    setIsEditing(false);
  };

  // 處理按下 Enter 或 Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditName(displayName);
      setIsEditing(false);
    }
  };

  // 刪除單一分頁
  const handleDeleteTab = (windowIndex, tabId) => {
    const updatedSession = JSON.parse(JSON.stringify(session));
    const win = updatedSession.windows[windowIndex];
    win.tabs = win.tabs.filter(tab => tab.id !== tabId);
    
    // 如果視窗沒有分頁了，移除整個視窗
    if (win.tabs.length === 0) {
      updatedSession.windows.splice(windowIndex, 1);
    }
    
    onUpdateSession(updatedSession);
  };

  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-150 ${isDeleted ? 'bg-gray-50/70 dark:bg-surface/50 border-gray-200/70 dark:border-hairline/60' : 'bg-white dark:bg-surface-card border-gray-200/90 dark:border-hairline hover:border-gray-300 dark:hover:border-hairline-strong shadow-sm'}`}>
      {/* Session 標題列 */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-surface-elevated/50 transition-colors"
        onClick={() => !isEditing && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* 展開/收合圖示 */}
          <svg 
            className={`w-4 h-4 text-gray-400 dark:text-ash transition-transform duration-150 flex-shrink-0 ${isExpanded ? 'rotate-90 text-gray-700 dark:text-ink' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-sm font-medium text-gray-900 dark:text-ink bg-white dark:bg-canvas border border-blue-400 dark:border-white/30 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <div 
                className={`text-sm font-medium truncate ${isDeleted ? 'text-gray-500 dark:text-mute cursor-default' : 'text-gray-900 dark:text-ink cursor-text hover:text-blue-600 dark:hover:text-white transition-colors'}`}
                onClick={(e) => {
                  if (isDeleted) return;
                  e.stopPropagation();
                  setEditName(session.name || displayName);
                  setIsEditing(true);
                }}
                title={isDeleted ? undefined : t('sessionItem.editNameHint')}
              >
                {displayName}
              </div>
            )}
            <div className="text-xs text-gray-400 dark:text-mute mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="whitespace-nowrap">{formatDateTime(session.createdAt)}</span>
              <span className="text-gray-300 dark:text-stone select-none">·</span>
              <span className="whitespace-nowrap inline-flex items-center gap-1">
                <span>{session.windows.length} {t('sessionItem.windows')}</span>
                <span className="text-gray-300 dark:text-stone select-none">·</span>
                <span>{session.totalTabs} {t('sessionItem.tabs')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
          {isDeleted ? (
            /* 已刪除模式：僅顯示還原按鈕 */
            <button
              onClick={() => onRestoreFromDeleted(session)}
              className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-accent-blue bg-blue-50 hover:bg-blue-100 dark:bg-accent-blue/10 dark:hover:bg-accent-blue/20 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
              title={t('sessionItem.restoreRecord')}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>{t('sessionItem.restoreRecord')}</span>
            </button>
          ) : (
            <>
              {/* 全部恢復按鈕 */}
              <button
                onClick={() => onRestore(session)}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:text-mute dark:hover:text-accent-green dark:hover:bg-accent-green/10 rounded-md transition-colors"
                title={t('sessionItem.restoreAll')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              {/* 更新紀錄按鈕 */}
              <button
                onClick={() => onOverwrite(session)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-mute dark:hover:text-accent-blue dark:hover:bg-accent-blue/10 rounded-md transition-colors"
                title={t('sessionItem.updateRecord')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* 刪除按鈕 */}
              <button
                onClick={() => onDelete(session.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-mute dark:hover:text-accent-red dark:hover:bg-accent-red/10 rounded-md transition-colors"
                title={t('sessionItem.delete')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 展開的分頁列表 */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-hairline bg-gray-50/80 dark:bg-surface/80 max-h-60 overflow-y-auto">
          {session.windows.map((win, winIndex) => (
            <div key={win.windowId || `win-${winIndex}`} className="border-b border-gray-100 dark:border-hairline/60 last:border-b-0">
              {/* 視窗標題 */}
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-surface-elevated/60 text-xs font-medium text-gray-600 dark:text-mute flex items-center justify-between border-b border-gray-200/40 dark:border-hairline/40">
                <span>{t('sessionItem.window')} {winIndex + 1} ({win.tabs.length} {t('sessionItem.tabs')})</span>
                <div className="flex items-center gap-1.5">
                  {win.left !== undefined && (
                    <span className="text-gray-400 dark:text-ash text-[10px]">
                      ({win.left}, {win.top})
                    </span>
                  )}
                  {/* 單獨打開此視窗按鈕 */}
                  <button
                    onClick={() => onRestoreWindow(win)}
                    className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:text-mute dark:hover:text-accent-green dark:hover:bg-accent-green/10 rounded transition-colors"
                    title={t('sessionItem.openWindow')}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0v12m0-12l-8 8M4 4v5h.582m.418 9h10a2 2 0 002-2V8" />
                    </svg>
                  </button>
                  {/* 刪除此視窗按鈕（僅一般模式顯示） */}
                  {!isDeleted && (
                    <button
                      onClick={() => onDeleteWindow(session.id, winIndex)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-mute dark:hover:text-accent-red dark:hover:bg-accent-red/10 rounded transition-colors"
                      title={t('sessionItem.deleteWindow')}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* 分頁列表 */}
              <div className="divide-y divide-gray-100 dark:divide-hairline/30">
                {win.tabs.map((tab) => (
                  <div 
                    key={tab.id}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-white dark:hover:bg-surface-elevated/50 transition-colors group"
                  >
                    {/* 分頁群組標示 */}
                    {tab.groupInfo && (
                      <div 
                        className="w-1 h-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: GROUP_COLORS[tab.groupInfo.color] || GROUP_COLORS.grey }}
                        title={tab.groupInfo.title || t('sessionItem.tabGroup')}
                      />
                    )}
                    
                    {/* Favicon */}
                    <img 
                      src={tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239CA3AF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'}
                      alt=""
                      className="w-4 h-4 flex-shrink-0 cursor-pointer"
                      onClick={() => onOpenTab(tab.url)}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239CA3AF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
                      }}
                    />
                    
                    {/* 標題 - 點擊開啟 */}
                    <span 
                      className="text-xs text-gray-700 dark:text-body truncate flex-1 cursor-pointer hover:text-blue-600 dark:hover:text-white transition-colors"
                      onClick={() => onOpenTab(tab.url)}
                      title={tab.url}
                    >
                      {tab.title}
                    </span>
                    
                    {/* 群組名稱標籤 */}
                    {tab.groupInfo && tab.groupInfo.title && (
                      <span 
                        className="text-[10px] px-1.5 py-0.5 rounded text-white flex-shrink-0"
                        style={{ backgroundColor: GROUP_COLORS[tab.groupInfo.color] || GROUP_COLORS.grey }}
                      >
                        {tab.groupInfo.title}
                      </span>
                    )}
                    
                    {/* 刪除分頁按鈕（僅一般模式顯示） */}
                    {!isDeleted && (
                      <button
                        onClick={() => handleDeleteTab(winIndex, tab.id)}
                        className="p-0.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 dark:text-ash dark:hover:text-accent-red dark:hover:bg-accent-red/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        title={t('sessionItem.deleteTab')}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
