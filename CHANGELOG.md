# 更新紀錄 / Changelog

所有重要的更新都會記錄在此文件中。
All notable changes to this project will be documented in this file.

---

## [1.2.0] - 2025-11-28

### 新增功能 / New Features

- **多語系支援** - 支援 5 種語言：繁體中文、简体中文、English、日本語、한국어
- **Multi-language Support** - Support 5 languages: Traditional Chinese, Simplified Chinese, English, Japanese, Korean

- **語言切換器** - 底部新增地球圖示，點擊可切換介面語言
- **Language Switcher** - Added globe icon at footer to switch interface language

- **自動語言偵測** - 根據瀏覽器語言自動選擇對應的介面語言
- **Auto Language Detection** - Automatically detect browser language and apply corresponding interface language

### 改進 / Improvements

- **預設語言** - 預設語言改為繁體中文
- **Default Language** - Changed default language to Traditional Chinese

- **隱私權政策** - 新增简体中文、日本語、한국어版本
- **Privacy Policy** - Added Simplified Chinese, Japanese, Korean versions

---

## [1.1.0] - 2025-11-28

### 新增功能 / New Features

- **更新紀錄按鈕** - 可使用目前開啟的分頁覆蓋現有 Session
- **Overwrite Session Button** - Overwrite existing session with currently open tabs

- **JSON 匯出/匯入** - 支援匯出所有紀錄為 JSON 檔案，並可匯入還原（支援合併或取代模式）
- **JSON Export/Import** - Export all sessions to JSON file and import with merge or replace options

- **刪除整個視窗** - 可一次刪除 Session 中的整個視窗，需二次確認
- **Delete Entire Window** - Delete all tabs in a window at once with confirmation

- **排除無痕模式** - 保存時自動排除無痕（Incognito）視窗
- **Exclude Incognito** - Automatically exclude incognito windows when saving

- **Lazy Loading** - 恢復分頁時，背景分頁延遲載入以提升效能
- **Lazy Loading** - Background tabs load on demand for better performance

### 改進 / Improvements

- **圖示更新** - 更換恢復功能的圖示，使用更直覺的外部連結與視窗彈出圖示
- **Icon Update** - Updated restore icons with more intuitive external link and window popup icons

- **匯入對話框** - 改善匯入功能的文字說明，更清楚區分「合併」與「取代」的差異
- **Import Dialog** - Improved import dialog text to clearly distinguish between merge and replace options

- **二次確認** - 取代匯入時增加二次確認，防止誤刪現有資料
- **Double Confirmation** - Added second confirmation when replacing to prevent accidental data loss

---

## [1.0.0] - 2025-11-27

### 初始版本 / Initial Release

- **即時保存** - 一鍵保存所有開啟的視窗與分頁
- **Instant Save** - One-click save all open windows and tabs

- **完整恢復** - 還原視窗位置、大小與分頁群組
- **Full Restore** - Restore window position, size and tab groups

- **分頁群組支援** - 保存並還原 Chrome 分頁群組（含顏色、名稱、摺疊狀態）
- **Tab Groups Support** - Save and restore Chrome tab groups (color, title, collapsed state)

- **編輯名稱** - 可自訂 Session 名稱方便識別
- **Edit Name** - Customize session names for easy identification

- **單一分頁操作** - 可開啟單一分頁或刪除個別分頁
- **Single Tab Actions** - Open or delete individual tabs

- **本地儲存** - 所有資料僅存於本地，保護隱私
- **Local Storage** - All data stored locally for privacy

- **多螢幕支援** - 智慧偵測螢幕邊界，確保視窗在可見範圍內還原
- **Multi-Monitor Support** - Smart screen boundary detection for proper window restoration
