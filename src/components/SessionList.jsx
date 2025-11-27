import SessionItem from './SessionItem';

/**
 * SessionList 元件 - 顯示 Session 列表
 */
export default function SessionList({ 
  sessions, 
  onRestore, 
  onDelete, 
  onOpenTab,
  onRestoreWindow,
  onUpdateSession,
  onClearAll 
}) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-sm">尚無保存的 Session</p>
        <p className="text-xs text-gray-400 mt-1">點擊上方按鈕保存目前的分頁</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 清空全部按鈕 */}
      <div className="flex justify-end mb-1">
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          清空全部
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
        />
      ))}
    </div>
  );
}
