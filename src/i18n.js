import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 語言包
import zhHant from './locales/zh-Hant.json';
import zhHans from './locales/zh-Hans.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

const resources = {
  'zh-Hant': { translation: zhHant },
  'zh-Hans': { translation: zhHans },
  'en': { translation: en },
  'ja': { translation: ja },
  'ko': { translation: ko },
};

// 語言對應表（處理瀏覽器語言代碼）
const languageMapping = {
  'zh-TW': 'zh-Hant',
  'zh-HK': 'zh-Hant',
  'zh-MO': 'zh-Hant',
  'zh-CN': 'zh-Hans',
  'zh-SG': 'zh-Hans',
  'zh': 'zh-Hans',
  'en-US': 'en',
  'en-GB': 'en',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-Hant',
    supportedLngs: ['zh-Hant', 'zh-Hans', 'en', 'ja', 'ko'],
    
    // 語言偵測設定
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    // 當偵測到的語言不在支援列表中時，嘗試轉換
    load: 'currentOnly',
  });

// 自訂語言偵測後的處理
const detectedLang = i18n.language;
if (languageMapping[detectedLang]) {
  i18n.changeLanguage(languageMapping[detectedLang]);
} else if (detectedLang && detectedLang.startsWith('zh')) {
  // 預設中文為繁體
  i18n.changeLanguage('zh-Hant');
}

export default i18n;
