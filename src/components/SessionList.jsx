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

  if (!showDeleted && sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-gray-300 dark:border-hairline bg-white/70 dark:bg-surface/50 my-auto shadow-sm">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-card border border-gray-200 dark:border-hairline flex items-center justify-center mb-3 text-gray-400 dark:text-ash">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-xs font-medium text-gray-800 dark:text-ink">{t('sessionList.empty')}</p>
        <p className="text-[11px] text-gray-400 dark:text-mute mt-0.5">{t('sessionList.emptyHint')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 頂部次要工具列 */}
      <div className="flex justify-between items-center px-1 mb-0.5">
        <span className="text-[11px] text-gray-500 dark:text-mute font-medium uppercase tracking-wider">
          {t('sessionList.title', 'Sessions')} ({sessions.length})
        </span>
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
