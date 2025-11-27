# Tab Session Lite

極致輕量、速度優先的 Chrome 分頁 Session 管理擴充功能。

**核心價值：Instant Save, Local Only.**

## 功能特色

- 🚀 **一鍵保存**：瞬間抓取所有視窗的所有分頁
- 📋 **歷史列表**：依時間倒序顯示已保存的 Session
- 🔄 **彈性恢復**：
  - 全部恢復：一鍵打開所有視窗與分頁
  - 個別恢復：點擊特定連結只開啟該分頁
- 📝 **複製功能**：將 Session 資料複製到剪貼簿
- 🗑️ **管理功能**：刪除單條或清空所有紀錄
- ⚡ **極速存取**：使用 Chrome Local Storage，無網路延遲

## 技術架構

- **框架**: React 19 + Vite 5
- **樣式**: Tailwind CSS 3.x
- **儲存**: chrome.storage.local
- **Manifest**: V3

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
4. 展開 Session 可查看個別分頁
5. 使用恢復/刪除/複製功能管理 Session

## 資料結構

```javascript
{
  "sessions": [
    {
      "id": "1701234567890",
      "createdAt": "2024-05-20T10:00:00.000Z",
      "totalTabs": 15,
      "windows": [
        {
          "windowId": 123,
          "tabs": [
            {
              "title": "Google",
              "url": "https://google.com",
              "favIconUrl": "..."
            }
          ]
        }
      ]
    }
  ]
}
```

## 授權

MIT License
