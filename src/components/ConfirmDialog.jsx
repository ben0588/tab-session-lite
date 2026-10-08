import { useTranslation } from 'react-i18next';

/**
 * ConfirmDialog 元件 - 支援雙主題確認對話框
 */
export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText, 
  cancelText, 
  type = 'danger' 
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const resolvedConfirmText = confirmText || t('dialog.confirm', '確認');
  const resolvedCancelText = cancelText || t('dialog.cancel', '取消');

  const confirmBtnClass = type === 'danger' 
    ? 'bg-red-500 hover:bg-red-600 text-white dark:bg-accent-red/20 dark:hover:bg-accent-red/30 dark:text-accent-red dark:border dark:border-accent-red/30' 
    : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200';

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-surface-elevated border border-gray-200 dark:border-hairline rounded-xl shadow-xl dark:shadow-2xl max-w-xs w-full overflow-hidden animate-scale-in">
        {/* 標題 */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-hairline flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-ink">{title}</h3>
          {type === 'danger' && (
            <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-accent-red"></span>
          )}
        </div>
        
        {/* 內容 */}
        <div className="px-4 py-3.5">
          <p className="text-xs text-gray-600 dark:text-body leading-relaxed whitespace-pre-line">{message}</p>
        </div>
        
        {/* 操作按鈕 */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-surface border-t border-gray-100 dark:border-hairline flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-mute hover:bg-gray-100 dark:hover:bg-surface-card/80 bg-white dark:bg-surface-card border border-gray-200 dark:border-hairline rounded-lg transition-colors"
          >
            {resolvedCancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shadow-sm active:scale-95 ${confirmBtnClass}`}
          >
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
