# 更新紀錄 / Changelog

所有重要的更新都會記錄在此文件中。
All notable changes to this project will be documented in this file.

---

## [1.5.0] - 2025-12-13

### 重大改進 / Major Improvements

-   **極致輕量化 Lazy Loading** - 採用「輕量化佔位頁面」技術，實現零 CPU 消耗的分頁恢復
-   **Ultra-Lightweight Lazy Loading** - Implemented "Lazy Placeholder Page" technique for zero CPU consumption during tab restoration

    -   使用極輕量 HTML 佔位頁面（< 4KB），取代直接載入目標網頁
    -   Use ultra-lightweight HTML placeholder page (< 4KB) instead of directly loading target pages
    -   保留原始網址、標題和圖示，使用者體驗不受影響
    -   Preserve original URL, title and favicon for seamless user experience
    -   點擊分頁時才真正載入，CPU 和記憶體消耗趨近於零
    -   Real page loads only when tab is clicked, CPU and memory usage near zero
    -   即使恢復 200+ 分頁也能瞬間完成，不會造成卡頓
    -   Instant restoration even with 200+ tabs without any lag

### 技術細節 / Technical Details

-   新增 `lazy.html` 輕量化佔位頁面，使用原生 JavaScript 實現自動轉址
-   Added `lazy.html` lightweight placeholder page with native JavaScript auto-redirect
-   更新 `manifest.json` 的 `web_accessible_resources` 配置
-   Updated `web_accessible_resources` in manifest.json
-   移除先前有問題的 `discarded: true` 和 `chrome.tabs.discard()` 方案
-   Removed problematic `discarded: true` and `chrome.tabs.discard()` approaches

---

## [1.4.1] - 2025-12-09

### 修正 / Bug Fixes

-   **全螢幕/最大化視窗恢復修正** - 修正全螢幕或最大化視窗在雙螢幕環境下無法正確恢復到原螢幕的問題
-   **Fullscreen/Maximized Window Restore Fix** - Fixed issue where fullscreen or maximized windows couldn't restore to the correct monitor in multi-monitor setup
    -   現在會先在正確螢幕位置建立視窗，再設定為全螢幕/最大化
    -   Now creates window at correct monitor position first, then applies fullscreen/maximized state

---

## [1.4.0] - 2025-12-05

### 改進 / Improvements

-   **大量分頁恢復優化** - 新增動態延遲策略，根據分頁數量自動調整恢復速度
-   **Large Session Restore Optimization** - Added dynamic delay strategy that automatically adjusts restore speed based on tab count

    -   少量分頁 (< 50)：極速模式，無延遲
    -   中等分頁 (50-100)：平衡模式，輕度延遲
    -   大量分頁 (> 100)：穩定模式，確保完整恢復

-   **錯誤容錯機制** - 單一視窗或分頁恢復失敗不會中斷整體恢復流程
-   **Error Tolerance** - Single window or tab restore failure won't interrupt the overall restore process

---

## [1.3.0] - 2025-12-05

### 新增功能 / New Features

-   **恢復聚焦分頁** - 保存時記錄當前聚焦的分頁，恢復時自動切換到該分頁
-   **Restore Active Tab** - Save the currently focused tab and automatically switch to it when restoring

-   **Chrome Web Store 多語系名稱** - 擴充功能名稱根據使用者語言顯示不同名稱
-   **Chrome Web Store i18n** - Extension name displays differently based on user's language
    -   zh_TW: Tab Session Lite - 分頁管理與一鍵保存
    -   zh_CN: Tab Session Lite - 分页管理与一键保存
    -   en: Tab Session Lite - Instant Tab Manager
    -   ja: Tab Session Lite - タブ管理 & ワンクリック保存
    -   ko: Tab Session Lite - 탭 관리 및 원클릭 저장

### 改進 / Improvements

-   **URL 過濾優化** - 擴充特殊頁面過濾，新增 edge://、brave://、opera://、vivaldi://、devtools://、data:、javascript: 等
-   **URL Filtering** - Enhanced special page filtering, added edge://, brave://, opera://, vivaldi://, devtools://, data:, javascript: etc.

---

## [1.2.0] - 2025-11-28

### 新增功能 / New Features

-   **多語系支援** - 支援 5 種語言：繁體中文、简体中文、English、日本語、한국어
-   **Multi-language Support** - Support 5 languages: Traditional Chinese, Simplified Chinese, English, Japanese, Korean

-   **語言切換器** - 底部新增地球圖示，點擊可切換介面語言
-   **Language Switcher** - Added globe icon at footer to switch interface language

-   **自動語言偵測** - 根據瀏覽器語言自動選擇對應的介面語言
-   **Auto Language Detection** - Automatically detect browser language and apply corresponding interface language

### 改進 / Improvements

-   **預設語言** - 預設語言改為繁體中文
-   **Default Language** - Changed default language to Traditional Chinese

-   **隱私權政策** - 新增简体中文、日本語、한국어版本
-   **Privacy Policy** - Added Simplified Chinese, Japanese, Korean versions

---

## [1.1.0] - 2025-11-28

### 新增功能 / New Features

-   **更新紀錄按鈕** - 可使用目前開啟的分頁覆蓋現有 Session
-   **Overwrite Session Button** - Overwrite existing session with currently open tabs

-   **JSON 匯出/匯入** - 支援匯出所有紀錄為 JSON 檔案，並可匯入還原（支援合併或取代模式）
-   **JSON Export/Import** - Export all sessions to JSON file and import with merge or replace options

-   **刪除整個視窗** - 可一次刪除 Session 中的整個視窗，需二次確認
-   **Delete Entire Window** - Delete all tabs in a window at once with confirmation

-   **排除無痕模式** - 保存時自動排除無痕（Incognito）視窗
-   **Exclude Incognito** - Automatically exclude incognito windows when saving

-   **Lazy Loading** - 恢復分頁時，背景分頁延遲載入以提升效能
-   **Lazy Loading** - Background tabs load on demand for better performance

### 改進 / Improvements

-   **圖示更新** - 更換恢復功能的圖示，使用更直覺的外部連結與視窗彈出圖示
-   **Icon Update** - Updated restore icons with more intuitive external link and window popup icons

-   **匯入對話框** - 改善匯入功能的文字說明，更清楚區分「合併」與「取代」的差異
-   **Import Dialog** - Improved import dialog text to clearly distinguish between merge and replace options

-   **二次確認** - 取代匯入時增加二次確認，防止誤刪現有資料
-   **Double Confirmation** - Added second confirmation when replacing to prevent accidental data loss

---

## [1.0.0] - 2025-11-27

### 初始版本 / Initial Release

-   **即時保存** - 一鍵保存所有開啟的視窗與分頁
-   **Instant Save** - One-click save all open windows and tabs

-   **完整恢復** - 還原視窗位置、大小與分頁群組
-   **Full Restore** - Restore window position, size and tab groups

-   **分頁群組支援** - 保存並還原 Chrome 分頁群組（含顏色、名稱、摺疊狀態）
-   **Tab Groups Support** - Save and restore Chrome tab groups (color, title, collapsed state)

-   **編輯名稱** - 可自訂 Session 名稱方便識別
-   **Edit Name** - Customize session names for easy identification

-   **單一分頁操作** - 可開啟單一分頁或刪除個別分頁
-   **Single Tab Actions** - Open or delete individual tabs

-   **本地儲存** - 所有資料僅存於本地，保護隱私
-   **Local Storage** - All data stored locally for privacy

-   **多螢幕支援** - 智慧偵測螢幕邊界，確保視窗在可見範圍內還原
-   **Multi-Monitor Support** - Smart screen boundary detection for proper window restoration
