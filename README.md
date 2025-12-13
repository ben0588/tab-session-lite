# Tab Session Lite - 分頁管理與一鍵保存

極致輕量、速度優先的 Chrome 分頁 Session 管理擴充功能。

**核心價值：Instant Save, Zero CPU, Local Only.**

[![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/pdfabpgjkeplngckadhocdioamjbdpdf?label=Version&logo=google-chrome)](https://chromewebstore.google.com/detail/tab-session-lite/pdfabpgjkeplngckadhocdioamjbdpdf)

## 功能特色

-   🚀 **一鍵保存**：瞬間抓取所有視窗的所有分頁
-   📋 **歷史列表**：依時間倒序顯示已保存的 Session
-   🔄 **彈性恢復**：
    -   全部恢復：一鍵還原所有視窗與分頁
    -   單一視窗恢復：只恢復特定視窗及其分頁
    -   單一分頁開啟：點擊特定連結開啟單一頁面
-   📍 **完整還原**：
    -   視窗位置還原：恢復時自動還原視窗的原始位置與大小
    -   分頁群組還原：保留分頁群組的名稱、顏色與排列順序
-   ✏️ **自訂管理**：
    -   編輯 Session 名稱，方便辨識與整理
    -   更新紀錄：用目前分頁覆蓋現有 Session
    -   刪除單一分頁、整個視窗或整個 Session
    -   清空所有紀錄
-   📦 **匯出/匯入**：支援 JSON 格式備份與還原
-   🔒 **隱私安全**：
    -   資料僅儲存於瀏覽器 Local Storage，不傳送至任何外部伺服器
    -   自動排除無痕模式視窗
-   ⚡ **極致效能優化**：
    -   **零 CPU 消耗 Lazy Loading**：採用輕量化佔位頁面技術（< 4KB），恢復 200+ 分頁也能瞬間完成
    -   **智慧載入**：只有點擊的分頁才會真正載入，CPU 和記憶體消耗趨近於零
    -   **無延遲恢復**：移除所有延遲策略，所有分頁瞬間出現在分頁列
-   🌐 **多語系支援**：繁體中文、简体中文、English、日本語、한국어

## 技術架構

-   **框架**: React 19 + Vite 5
-   **樣式**: Tailwind CSS 3.x
-   **多語系**: react-i18next + i18next
-   **儲存**: chrome.storage.local
-   **Manifest**: V3

## 開發指令

```bash
# 安裝相依套件
npm install

# 開發模式（支援 HMR）
npm run dev

# 建構生產版本
npm run build

# 生成圖示
npm run icons
```

## 安裝擴充功能

1. 執行 `npm run build` 建構專案
2. 開啟 Chrome，進入 `chrome://extensions/`
3. 開啟右上角「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選擇專案的 `dist` 資料夾

## 使用方式

1. 點擊瀏覽器工具列的 Tab Session Lite 圖示
2. 點擊「立即保存」按鈕保存當前所有分頁
3. 在列表中查看已保存的 Session
4. 點擊 Session 名稱可編輯名稱
5. 展開 Session 可查看個別分頁與視窗
6. 使用恢復/刪除功能管理 Session

## 資料結構

```javascript
{
  "sessions": [
    {
      "id": "1701234567890",
      "name": "工作用分頁",
      "createdAt": "2024-05-20T10:00:00.000Z",
      "totalTabs": 15,
      "windows": [
        {
          "windowId": 123,
          "left": 0,
          "top": 0,
          "width": 1920,
          "height": 1080,
          "state": "maximized",
          "tabs": [
            {
              "id": "unique-tab-id",
              "title": "Google",
              "url": "https://google.com",
              "favIconUrl": "...",
              "groupId": 1,
              "groupInfo": {
                "title": "搜尋",
                "color": "blue",
                "collapsed": false
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## 隱私權政策

[查看隱私權政策](./PRIVACY_POLICY.md)

## 更新紀錄

查看完整的 [更新紀錄 / Changelog](./CHANGELOG.md)

## 授權

MIT License
