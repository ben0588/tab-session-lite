/**
 * Banner 元件 - 底部資訊區塊
 */
export default function Banner() {
  // 請將此連結替換為您的實際連結
  const GITHUB_URL = "https://github.com/ben0588/tab-session-lite";
  const DONATE_URL = "https://buymeacoffee.com/energy9527z";
  const PRIVACY_URL = "https://github.com/ben0588/tab-session-lite/blob/main/PRIVACY_POLICY.md";

  return (
    <div className="mt-auto pt-2 border-t border-gray-100">
      {/* 主要操作區 - 緊湊的一行設計 */}
      <div className="flex items-center justify-center gap-3 py-2">
        {/* GitHub */}
        <a 
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
          title="在 GitHub 上查看原始碼"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>開源</span>
        </a>

        <span className="text-gray-200">|</span>

        {/* 贊助 */}
        <a 
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all group"
          title="請我喝杯咖啡"
        >
          <span className="group-hover:scale-110 transition-transform">☕</span>
          <span>贊助</span>
        </a>

        <span className="text-gray-200">|</span>

        {/* 隱私權政策 */}
        <a 
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
          title="隱私權政策"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>隱私</span>
        </a>
      </div>

      {/* 版本資訊 */}
      <div className="text-center pb-1">
        <span className="text-[10px] text-gray-300">v1.0.0 · Local Only · No Tracking</span>
      </div>
    </div>
  );
}
