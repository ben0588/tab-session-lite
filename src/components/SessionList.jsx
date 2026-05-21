import { useTranslation } from 'react-i18next';
import SessionItem from './SessionItem';

/**
 * SessionList 元件 - 顯示 Session 列表
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
      <div className="flex flex-col gap-2">
        {/* 工具列：最近刪除 + 清空全部 */}
        <div className="flex justify-end items-center gap-3 mb-1">
          <button
            onClick={onToggleDeleted}
            className={`text-xs transition-colors flex items-center gap-1 ${
              showDeleted ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('sessionList.recentlyDeleted')}
            {deletedSessions.length > 0 && (
              <span className="bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-xs leading-none">
                {deletedSessions.length}
              </span>
            )}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm">{t('sessionList.empty')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('sessionList.emptyHint')}</p>
        </div>
      </div>
    );
  }

  // 顯示最近刪除清單
  if (showDeleted) {
    return (
      <div className="flex flex-col gap-2">
        {/* 工具列 */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xs font-semibold text-gray-700 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('sessionList.recentlyDeletedTitle', { count: deletedSessions.length })}
          </h2>
          <button
            onClick={onToggleDeleted}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            ← {t('sessionList.backToList')}
          </button>
        </div>

        {/* 提示文案 */}
        <p className="text-xs text-gray-400 mb-1">{t('sessionList.recentlyDeletedHint')}</p>

        {/* 已刪除清單 */}
        {deletedSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-sm">{t('sessionList.recentlyDeletedEmpty')}</p>
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

  return (
    <div className="flex flex-col gap-2">
      {/* 工具列：最近刪除 + 清空全部 */}
      <div className="flex justify-end items-center gap-3 mb-1">
        <button
          onClick={onToggleDeleted}
          className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('sessionList.recentlyDeleted')}
          {deletedSessions.length > 0 && (
            <span className="bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-xs leading-none">
              {deletedSessions.length}
            </span>
          )}
        </button>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
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
