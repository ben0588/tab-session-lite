/**
 * Toast 元件 - 懸浮於頂部的精緻對稱膠囊提示 (Raycast HUD 風格)
 * 具備 1px hairline 細緻邊框與柔和狀態微光 Icon，移除多餘關閉鈕以確保閱讀流暢
 */
export default function Toast({ message, type = 'success' }) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/15 text-red-600 dark:bg-accent-red-soft dark:text-accent-red flex-shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        );
      case 'info':
        return (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/15 text-blue-600 dark:bg-accent-blue-soft dark:text-accent-blue flex-shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        );
      case 'success':
      default:
        return (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/15 text-green-600 dark:bg-accent-green-soft dark:text-accent-green flex-shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        );
    }
  };

  return (
    <div className="fixed top-7 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
      <div 
        className="w-[330px] max-w-[calc(100%-2rem)] flex items-center gap-2.5 bg-white/95 dark:bg-surface-elevated/95 backdrop-blur-md text-gray-900 dark:text-ink px-3.5 py-2 rounded-full border border-gray-200/90 dark:border-hairline shadow-xl shadow-black/10 dark:shadow-2xl pointer-events-auto animate-fade-in"
      >
        {getIcon()}
        <p className="text-xs font-medium text-gray-800 dark:text-ink leading-snug select-text flex-1">
          {message}
        </p>
      </div>
    </div>
  );
}
