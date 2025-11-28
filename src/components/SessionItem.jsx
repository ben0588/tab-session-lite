import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../utils/storage';

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
 * SessionItem 元件 - 顯示單一 Session 項目
 */
export default function SessionItem({ 
  session, 
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
  const [editName, setEditName] = useState(session.name || '');

  // 保存名稱
  const handleSaveName = () => {
    if (editName.trim()) {
      const updatedSession = { ...session, name: editName.trim() };
      onUpdateSession(updatedSession);
    }
    setIsEditing(false);
  };

  // 處理按下 Enter 或 Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditName(session.name || '');
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Session 標題列 */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => !isEditing && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* 展開/收合圖示 */}
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          <div className="min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-medium text-gray-900 border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <div 
                className="text-sm font-medium text-gray-900 truncate cursor-text hover:text-blue-600"
                onClick={() => setIsEditing(true)}
                title={t('sessionItem.editNameHint')}
              >
                {session.name || `Session ${formatDateTime(session.createdAt)}`}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-0.5">
              {formatDateTime(session.createdAt)} · {session.windows.length} {t('sessionItem.windows')} · {session.totalTabs} {t('sessionItem.tabs')}
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
          {/* 全部恢復按鈕 - 使用外連箭頭圖示 */}
          <button
            onClick={() => onRestore(session)}
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
            title={t('sessionItem.restoreAll')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          {/* 更新紀錄按鈕 */}
          <button
            onClick={() => onOverwrite(session)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title={t('sessionItem.updateRecord')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* 刪除按鈕 */}
          <button
            onClick={() => onDelete(session.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title={t('sessionItem.delete')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 展開的分頁列表 */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 max-h-64 overflow-y-auto">
          {session.windows.map((win, winIndex) => (
            <div key={win.windowId || `win-${winIndex}`} className="border-b border-gray-100 last:border-b-0">
              {/* 視窗標題 */}
              <div className="px-3 py-2 bg-gray-100 text-xs font-medium text-gray-600 flex items-center justify-between">
                <span>{t('sessionItem.window')} {winIndex + 1} ({win.tabs.length} {t('sessionItem.tabs')})</span>
                <div className="flex items-center gap-2">
                  {win.left !== undefined && (
                    <span className="text-gray-400 text-xs">
                      ({win.left}, {win.top})
                    </span>
                  )}
                  {/* 單獨打開此視窗按鈕 - 視窗彈出圖示 */}
                  <button
                    onClick={() => onRestoreWindow(win)}
                    className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title={t('sessionItem.openWindow')}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0v12m0-12l-8 8M4 4v5h.582m.418 9h10a2 2 0 002-2V8" />
                    </svg>
                  </button>
                  {/* 刪除此視窗按鈕 */}
                  <button
                    onClick={() => onDeleteWindow(session.id, winIndex)}
                    className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title={t('sessionItem.deleteWindow')}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 分頁列表 */}
              <div className="divide-y divide-gray-100">
                {win.tabs.map((tab) => (
                  <div 
                    key={tab.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white transition-colors group"
                  >
                    {/* 分頁群組標示 */}
                    {tab.groupInfo && (
                      <div 
                        className="w-1 h-4 rounded-full flex-shrink-0"
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
                      className="text-xs text-gray-700 truncate flex-1 cursor-pointer hover:text-blue-600"
                      onClick={() => onOpenTab(tab.url)}
                      title={tab.url}
                    >
                      {tab.title}
                    </span>
                    
                    {/* 群組名稱標籤 */}
                    {tab.groupInfo && tab.groupInfo.title && (
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded text-white flex-shrink-0"
                        style={{ backgroundColor: GROUP_COLORS[tab.groupInfo.color] || GROUP_COLORS.grey }}
                      >
                        {tab.groupInfo.title}
                      </span>
                    )}
                    
                    {/* 刪除分頁按鈕 */}
                    <button
                      onClick={() => handleDeleteTab(winIndex, tab.id)}
                      className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0"
                      title={t('sessionItem.deleteTab')}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
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
