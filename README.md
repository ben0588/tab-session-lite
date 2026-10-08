<p align="right">
  <strong>繁體中文</strong> | <a href="./README.en.md">English</a> | <a href="./README.ja.md">日本語</a> | <a href="./README.ko.md">한국어</a> | <a href="./README.zh-Hans.md">简体中文</a>
</p>

# Tab Session Lite - 分頁管理與一鍵保存

極致輕量、速度優先的 Chrome 分頁 Session 管理擴充功能。

**核心價值：Instant Save, Zero CPU, Local Only.**

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/pdfabpgjkeplngckadhocdioamjbdpdf?label=Version&logo=google-chrome)](https://chromewebstore.google.com/detail/tab-session-lite/pdfabpgjkeplngckadhocdioamjbdpdf)

## 功能特色

- **一鍵秒存 (Instant Save)**：毫秒級瞬間快照所有視窗與分頁群組，操作絲滑無延遲。
- **極致效能 (Zero CPU Lazy Loading)**：
  - 採用輕量化佔位頁面機制（< 4KB），一次還原 200+ 分頁亦零 CPU 負擔。
  - 只有點擊的分頁才會真正載入網頁內容，徹底告別記憶體飆高與瀏覽器當機。
  - 分頁列瞬間完全展開，移除所有多餘的延遲等待。
- **高保真完整還原 (Full Fidelity)**：
  - 視窗幾何還原：自動保留並還原視窗的螢幕座標、寬高尺寸與顯示器位置。
  - 分頁群組還原：完整保留 Chrome 原生 Tab Groups 的名稱、顏色標記與排列順序。
- **彈性恢復機制**：
  - 全部恢復：一鍵還原跨視窗所有內容。
  - 單一視窗還原：僅恢復特定視窗及其分頁。
  - 單一分頁開啟：直接點擊特定連結開啟獨立頁面。
- **最近刪除安全緩衝 (Recently Deleted Buffer)**：
  - 內建回收暫存區，自動保留最近 7 筆刪除紀錄（先進先出）。
  - 防止手滑誤刪，支援一鍵即時救回主清單。
- **雙主題系統 (Dual Theme System)**：
  - 經典亮色 (Classic Light)：清爽簡潔的經典視窗風格。
  - 極客暗黑 (Raycast Dark)：純黑畫布與 1px hairline 細框的沉浸式極客美學。
- **本機隱私保護 (Local-Only Architecture)**：
  - 所有分頁資訊與設定 100% 僅儲存於本機 `chrome.storage.local`，嚴禁外連任何雲端伺服器。
  - 自動排除無痕模式（Incognito）視窗，守護使用者隱私。
- **離線資料管理**：
  - 就地重新命名：點擊名稱即可就地修改，支援用目前開啟分頁一鍵覆蓋更新。
  - 支援標準 JSON 格式匯出與匯入（可選合併現有或完全取代），方便跨裝置移轉。
- **完整多語系支援**：
  - 繁體中文、English、日本語、한국어、简体中文。

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

1. 執行以下指令建構專案（若看不到新功能，先清除快取再重建）：
   ```bash
   # 一般建構
   npm run build

   # 清除快取後重建（CMD）
   rmdir /s /q dist && npm run build

   # 清除快取後重建（PowerShell）
   Remove-Item dist -Recurse -Force ; npm run build
   ```
2. 開啟 Chrome，進入 `chrome://extensions/`
3. 開啟右上角「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選擇專案的 `dist` 資料夾
6. 若已載入過，點擊擴充功能卡片上的「重新載入」按鈕

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
