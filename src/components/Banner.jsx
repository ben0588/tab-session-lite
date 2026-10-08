import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { getAppVersion } from '../utils/storage';

/**
 * Banner 元件 - 底部資訊區塊
 */
export default function Banner({ onShowToast, theme, onToggleTheme }) {
  const { t } = useTranslation();
  
  const GITHUB_URL = "https://github.com/ben0588/tab-session-lite";
  const PRIVACY_URL = "https://github.com/ben0588/tab-session-lite/blob/main/PRIVACY_POLICY.md";

  const handleSponsorClick = () => {
    if (onShowToast) {
      onShowToast(t('toast.sponsorThanks'), 'info');
    }
  };

  return (
    <div className="mt-auto py-1.5 border-t border-gray-200/70 dark:border-hairline transition-colors">
      {/* 單行工具與偏好設定列 - 純黑白簡約設計 */}
      <div className="flex items-center justify-center gap-1.5 flex-nowrap text-xs">
        {/* GitHub 開源 */}
        <a 
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-1.5 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-mute dark:hover:text-ink dark:hover:bg-surface-elevated rounded-md transition-all whitespace-nowrap"
          title={t('banner.openSourceTitle')}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>{t('banner.openSource')}</span>
        </a>

        <span className="text-gray-300 dark:text-stone select-none">·</span>

        {/* 贊助 (純黑白線條咖啡杯圖示) */}
        <button 
          onClick={handleSponsorClick}
          className="flex items-center gap-1 px-1.5 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-mute dark:hover:text-ink dark:hover:bg-surface-elevated rounded-md transition-all whitespace-nowrap"
          title={t('banner.donateTitle')}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
          </svg>
          <span>{t('banner.donate')}</span>
        </button>

        <span className="text-gray-300 dark:text-stone select-none">·</span>

        {/* 隱私權政策 (純黑白盾牌圖示) */}
        <a 
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-1.5 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-mute dark:hover:text-ink dark:hover:bg-surface-elevated rounded-md transition-all whitespace-nowrap"
          title={t('banner.privacyTitle')}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>{t('banner.privacy')}</span>
        </a>

        <span className="text-gray-300 dark:text-stone select-none">·</span>

        {/* 語言切換 (純黑白地球圖示) */}
        <LanguageSwitcher />

        {/* 主題切換 (純黑白太陽/月亮圖示) */}
        {onToggleTheme && (
          <>
            <span className="text-gray-300 dark:text-stone select-none">·</span>
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-mute dark:hover:text-ink dark:hover:bg-surface-elevated rounded-md transition-all"
              title={theme === 'dark' ? t('banner.themeLight') : t('banner.themeDark')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-3.5 h-3.5 flex-shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 flex-shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </>
        )}

        <span className="text-gray-300 dark:text-stone select-none">·</span>

        {/* 極簡版本號標示 (動態連動 manifest / package) */}
        <span className="text-[10px] text-gray-400 dark:text-ash tracking-wide select-none">
          {getAppVersion()}
        </span>
      </div>
    </div>
  );
}
