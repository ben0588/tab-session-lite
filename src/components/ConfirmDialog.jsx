/**
 * ConfirmDialog 元件 - 確認對話框
 */
export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = '確認',
  cancelText = '取消',
  type = 'danger'
}) {
  if (!isOpen) return null;

  const confirmBtnClass = type === 'danger' 
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-blue-500 hover:bg-blue-600 text-white';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden animate-scale-in">
        {/* 標題 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        {/* 內容 */}
        <div className="px-4 py-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        
        {/* 按鈕 */}
        <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${confirmBtnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
