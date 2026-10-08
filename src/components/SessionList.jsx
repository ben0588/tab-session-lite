import { useTranslation } from 'react-i18next';
import SessionItem from './SessionItem';

/**
 * SessionList 元件 - 顯示 Session 列表 (支援雙主題)
 */
export default function SessionList({ 
  sessions,
  deletedSessions = [],
  showDeleted = false,
  onToggleDeleted,
  onRestore, 
  onDelete, 
  onOpenTab,
  onRestoreWindow,
  onUpdateSession,
  onOverwrite,
  onDeleteWindow,
  onClearAll,
  onRestoreFromDeleted,
}) {
  const { t } = useTranslation();

  // 1. 最近刪除檢視模式
  if (showDeleted) {
    return (
      <div className="flex flex-col gap-2">
        {/* 工具列：標題 + 返回清單 */}
        <div className="flex justify-between items-center px-1 mb-0.5">
          <span className="text-[11px] text-gray-700 dark:text-ink font-semibold flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-ash" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('sessionList.recentlyDeletedTitle', { count: deletedSessions.length })}
          </span>
          <button
            onClick={onToggleDeleted}
            className="text-[11px] text-blue-600 hover:text-blue-700 dark:text-accent-blue dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-accent-blue/10"
          >
            ← {t('sessionList.backToList')}
          </button>
        </div>

        {/* 說明提示字 */}
        <p className="text-[11px] text-gray-400 dark:text-mute px-1 -mt-1 leading-normal">
          {t('sessionList.recentlyDeletedHint')}
        </p>

        {/* 已刪除列表 */}
        {deletedSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-gray-300 dark:border-hairline bg-white/70 dark:bg-surface/50 my-auto shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-card border border-gray-200 dark:border-hairline flex items-center justify-center mb-3 text-gray-400 dark:text-ash">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-800 dark:text-ink">{t('sessionList.recentlyDeletedEmpty')}</p>
          </div>
        ) : (
          deletedSessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isDeleted={true}
              onRestoreFromDeleted={onRestoreFromDeleted}
              onRestore={onRestore}
              onDelete={onDelete}
              onOpenTab={onOpenTab}
              onRestoreWindow={onRestoreWindow}
              onUpdateSession={onUpdateSession}
              onOverwrite={onOverwrite}
              onDeleteWindow={onDeleteWindow}
            />
          ))
        )}
      </div>
    );
  }

  // 2. 一般模式：空狀態
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col gap-2 h-full">
        {/* 若有最近刪除，頂部提供切換入口 */}
        {deletedSessions.length > 0 && (
          <div className="flex justify-end items-center px-1 mb-0.5">
            <button
              onClick={onToggleDeleted}
              className="text-[11px] text-gray-500 hover:text-gray-900 dark:text-mute dark:hover:text-ink transition-colors flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-surface-elevated"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('sessionList.recentlyDeleted')}
              <span className="bg-gray-200 dark:bg-surface-elevated text-gray-600 dark:text-mute rounded-full px-1.5 py-0.2 text-[10px] font-semibold leading-none">
                {deletedSessions.length}
              </span>
            </button>
          </div>
        )}

        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-gray-300 dark:border-hairline bg-white/70 dark:bg-surface/50 my-auto shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-card border border-gray-200 dark:border-hairline flex items-center justify-center mb-3 text-gray-400 dark:text-ash">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-800 dark:text-ink">{t('sessionList.empty')}</p>
          <p className="text-[11px] text-gray-400 dark:text-mute mt-0.5">{t('sessionList.emptyHint')}</p>
        </div>
      </div>
    );
  }

  // 3. 一般模式：主清單列表
  return (
    <div className="flex flex-col gap-2">
      {/* 頂部次要工具列 */}
      <div className="flex justify-between items-center px-1 mb-0.5">
        <span className="text-[11px] text-gray-500 dark:text-mute font-medium uppercase tracking-wider">
          {t('sessionList.title', 'Sessions')} ({sessions.length})
        </span>
        <div className="flex items-center gap-2">
          {/* 最近刪除切換按鈕 */}
          {deletedSessions.length > 0 && (
            <button
              onClick={onToggleDeleted}
              className="text-[11px] text-gray-500 hover:text-gray-900 dark:text-mute dark:hover:text-ink transition-colors flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-surface-elevated"
              title={t('sessionList.recentlyDeleted')}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('sessionList.recentlyDeleted')}
              <span className="bg-gray-200 dark:bg-surface-elevated text-gray-600 dark:text-mute rounded-full px-1.5 py-0.2 text-[10px] font-semibold leading-none">
                {deletedSessions.length}
              </span>
            </button>
          )}

          {/* 清空全部按鈕 */}
          <button
            onClick={onClearAll}
            className="text-[11px] text-gray-500 hover:text-red-600 dark:text-mute dark:hover:text-accent-red transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-surface-elevated"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('sessionList.clearAll')}
          </button>
        </div>
      </div>

      {/* Session 列表 */}
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          onRestore={onRestore}
          onDelete={onDelete}
          onOpenTab={onOpenTab}
          onRestoreWindow={onRestoreWindow}
          onUpdateSession={onUpdateSession}
          onOverwrite={onOverwrite}
          onDeleteWindow={onDeleteWindow}
        />
      ))}
    </div>
  );
}
