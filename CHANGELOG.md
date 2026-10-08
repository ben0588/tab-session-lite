# 更新紀錄 / Changelog

所有重要的更新都會記錄在此文件中。
All notable changes to this project will be documented in this file.

---

## [1.6.0] - 2026-10-08

### 重大改進與新功能 / Major Improvements & Features

-   **雙主題切換系統 / Dual Theme System** - 支援經典亮色與 Raycast 極黑暗黑主題切換，搭配 1px hairline 細緻邊框與純黑畫布。
    -   Support seamless switching between Classic Light and Raycast-style Dark themes with hairline borders.
-   **全語系說明文件擴充 / Documentation i18n** - 補齊 5 國語言 README（繁體中文、English、日本語、한국어、简体中文）與頂部快速切換列。
    -   Added comprehensive README documentation in 5 languages with quick language-switch headers.

### 介面與體驗優化 / UI & UX Polish

-   **主操作區聚焦 / Primary CTA Polish** - Header「立即保存」按鈕高度微增至 36px，手感更立體明確，次要設定按鈕移出 Header。
    -   Optimized "Save Now" button height to 36px for better click target, removing non-essential controls from Header.
-   **資訊欄群組化防折行 / Metadata Grouping & No-Wrap** - 視窗與分頁數量群組化並加上不換行保護，徹底解決小寬度下「個分頁」單獨折行斷裂的問題。
    -   Grouped window and tab counters with `whitespace-nowrap inline-flex` to prevent unwanted line breaks.
-   **在地化親和性文案 / Localized & Friendly Wording** - 副標題在地化（「即時保存 · 本地儲存」），清單標頭與卡片預設名稱去除生硬的「Session」技術專有名詞。
    -   Localized subtitle ("Instant Save, Local Only") and softened technical jargon across all 5 languages.
-   **純黑白極簡單行 Footer / Monochrome Minimalist Footer** -
    -   將深淺主題開關移至語言切換右側，整合全域偏好設定。
    -   Moved theme toggle next to language selector in Footer for unified preference management.
    -   所有圖示全面採純黑白單色 SVG（移除彩色 Emoji 與彩色 hover 樣式）。
    -   Adopted pure monochrome SVG icons for all action buttons (removed colored emojis and hover states).
    -   移除第二行冗餘文字，將版本號整合為低調單行灰標，釋放約 20px 歷史列表垂直高度。
    -   Condensed footer to a compact single-line layout, saving ~20px of vertical space for the session list.
-   **對話框動態名稱與語意統一 / Dialog Semantic Alignment & Dynamic Name** -
    -   刪除確認對話框動態帶入目標紀錄名稱（「確定要刪除『{{name}}』嗎？」），清單清空對話框全面替換為「紀錄」詞彙。
    -   Dynamic target record name in delete confirmation dialog, replacing technical "Session" terms with friendly "record" across all 5 languages.
-   **頂部 Raycast 膠囊 HUD 與對稱 1px Hairline / Top Capsule HUD & 1px Hairline** -
    -   Toast 改為頂部 `top-7` 浮動膠囊 HUD，統一採用 `330px` 固定工整寬度，消除寬度伸縮跳動與眼球漂移問題。
    -   Refactored Toast into a sleek capsule HUD (`top-7`) with unified 330px width, removing redundant close button and layout jitter.
    -   顯示時長語意分級：一般操作縮短至 `1.8s`，錯誤提示維持 `3s`，搭配防抖定時器清理，節奏更俐落且杜絕連點競態關閉 bug。
    -   Tiered toast display duration (1.8s for success/info, 3s for error) with timer debounce cleanup for snappier feedback.
-   **最近刪除安全緩衝與彈窗多語系修復 / Recently Deleted Buffer & Dialog i18n Fix** -
    -   修復清空彈窗未配置多語系鍵值導致顯示 `dialog.moveToTrash` 的問題，完整補齊 5 國語言鍵值。
    -   Fixed missing translation keys causing raw `dialog.moveToTrash` in clear-all confirmation dialog across all 5 languages.
    -   清空或刪除時將紀錄移至「最近刪除」（最多保留 7 筆，先進先出），消除「無法復原」之語意矛盾。
    -   Records moved to Recently Deleted (up to 7 items buffer, FIFO) on delete or clear-all, removing contradictory "cannot be undone" prompts.
    -   列表工具列整合「最近刪除」檢視切換與一鍵還原回主清單。
    -   Integrated Recently Deleted view toggle with badge count and one-click restore functionality in SessionList.

---

## [1.5.1] - 2025-12-14

### 修正 / Bug Fixes

-   **Lazy 分頁保存修正** - 修正未點開的 lazy 分頁在再次保存時會遺失的問題
-   **Lazy Page Save Fix** - Fixed issue where unclicked lazy tabs would be lost when saving again

    -   新增 `resolveRealTabInfo()` 函數，自動解析 lazy 佔位頁面的真實 URL
    -   Added `resolveRealTabInfo()` function to automatically parse real URL from lazy placeholder pages
    -   更新 `saveSession()` 和 `overwriteSession()` 函數，在保存前先解析 lazy 分頁
    -   Updated `saveSession()` and `overwriteSession()` to resolve lazy tabs before saving
    -   優化 lazy.html 載入邏輯，避免分頁被意外轉址
    -   Optimized lazy.html loading logic to prevent accidental redirects

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
