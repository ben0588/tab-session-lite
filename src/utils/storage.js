/**
 * Chrome Storage 工具函式
 * 處理 Session 的儲存、讀取、刪除操作
 */

// 儲存鍵名
const STORAGE_KEY = 'sessions';
const DELETED_STORAGE_KEY = 'deletedSessions';
const MAX_DELETED_SESSIONS = 7;

/**
 * 檢查 URL 是否可以被擴充功能開啟
 * Chrome 基於安全考量，禁止擴充功能開啟特殊頁面
 * @param {string} url - 要檢查的 URL
 * @returns {boolean} 是否為有效可開啟的 URL
 */
const isValidUrl = (url) => {
    if (!url) return false;

    // 過濾瀏覽器特殊頁面（無法透過 chrome.tabs.create 開啟）
    const invalidPrefixes = [
        'chrome://', // Chrome 設定頁面
        'chrome-extension://', // 擴充功能頁面
        'edge://', // Edge 瀏覽器設定
        'brave://', // Brave 瀏覽器設定
        'opera://', // Opera 瀏覽器設定
        'vivaldi://', // Vivaldi 瀏覽器設定
        'about:', // about:blank 等
        'view-source:', // 原始碼檢視
        'devtools://', // 開發者工具
        'data:', // Data URLs (通常無意義保存)
        'javascript:', // JavaScript URLs
    ];

    return !invalidPrefixes.some((prefix) => url.toLowerCase().startsWith(prefix));
};

/**
 * 解析分頁資訊
 * 如果是 Lazy Loading 的佔位頁面，則還原其真實的 URL 和標題
 * @param {Object} tab - Chrome Tab 物件
 * @returns {Object} 解析後的 Tab 物件
 */
const resolveRealTabInfo = (tab) => {
    // 偵測是否為我們的 Lazy 佔位頁面
    // 檢查 url 是否存在且包含 lazy.html (避免誤判其他 extension 頁面)
    if (tab.url && tab.url.includes('/lazy.html?')) {
        try {
            const urlObj = new URL(tab.url);
            const realUrl = urlObj.searchParams.get('url');
            const realTitle = urlObj.searchParams.get('title');
            const realFavIcon = urlObj.searchParams.get('favIconUrl');

            if (realUrl) {
                // 回傳一個新的物件，將 URL 替換回真實網址
                return {
                    ...tab,
                    url: decodeURIComponent(realUrl), // 解碼 URL
                    // 如果有保存標題就用保存的，否則用目前的（目前的可能是 "Loading..."）
                    title: realTitle ? decodeURIComponent(realTitle) : tab.title,
                    // 還原圖示
                    favIconUrl: realFavIcon ? decodeURIComponent(realFavIcon) : tab.favIconUrl
                };
            }
        } catch (e) {
            console.warn('解析 Lazy URL 失敗:', e);
        }
    }
    // 如果不是 Lazy 頁面，或是解析失敗，就原樣回傳
    return tab;
};

/**
 * 取得所有 Sessions
 * @returns {Promise<Array>} Sessions 陣列
 */
export const loadSessions = async () => {
    try {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        return result[STORAGE_KEY] || [];
    } catch (error) {
        console.error('載入 Sessions 失敗:', error);
        return [];
    }
};

/**
 * 取得最近刪除的 Sessions
 * @returns {Promise<Array>} 最近刪除的 Sessions 陣列
 */
export const loadDeletedSessions = async () => {
    try {
        const result = await chrome.storage.local.get(DELETED_STORAGE_KEY);
        return result[DELETED_STORAGE_KEY] || [];
    } catch (error) {
        console.error('載入已刪除 Sessions 失敗:', error);
        return [];
    }
};

/**
 * 將 Session 加入最近刪除清單（最多保留 MAX_DELETED_SESSIONS 筆）
 * @param {Object} session - 要加入已刪除清單的 Session 物件
 */
const addToDeletedSessions = async (session) => {
    try {
        const deleted = await loadDeletedSessions();
        const updated = [session, ...deleted].slice(0, MAX_DELETED_SESSIONS);
        await chrome.storage.local.set({ [DELETED_STORAGE_KEY]: updated });
    } catch (error) {
        console.error('加入已刪除 Sessions 失敗:', error);
    }
};

/**
 * 從最近刪除清單中還原 Session 至主清單
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object|false>} 還原的 Session 物件，失敗則回傳 false
 */
export const restoreFromDeletedSession = async (sessionId) => {
    try {
        const deleted = await loadDeletedSessions();
        const sessionToRestore = deleted.find((s) => s.id === sessionId);
        if (!sessionToRestore) return false;

        // 從已刪除清單移除
        const updatedDeleted = deleted.filter((s) => s.id !== sessionId);
        await chrome.storage.local.set({ [DELETED_STORAGE_KEY]: updatedDeleted });

        // 加回主清單（置頂）
        const sessions = await loadSessions();
        const updatedSessions = [sessionToRestore, ...sessions];
        await chrome.storage.local.set({ [STORAGE_KEY]: updatedSessions });

        return sessionToRestore;
    } catch (error) {
        console.error('還原已刪除 Session 失敗:', error);
        return false;
    }
};

/**
 * 保存當前所有視窗的分頁
 * @returns {Promise<Object>} 新建立的 Session 物件
 */
export const saveSession = async () => {
    try {
        // 取得所有視窗（包含位置與大小資訊）
        const windows = await chrome.windows.getAll({ populate: true });

        // 過濾掉無痕模式視窗
        const normalWindows = windows.filter((win) => !win.incognito);

        // 取得所有分頁群組資訊
        let tabGroups = [];
        try {
            tabGroups = await chrome.tabGroups.query({});
        } catch (_e) {
            // tabGroups API 可能不支援，忽略錯誤
            console.log('Tab Groups API not available');
        }

        // 建立群組 ID 對應表
        const groupMap = {};
        tabGroups.forEach((group) => {
            groupMap[group.id] = {
                title: group.title || '',
                color: group.color,
                collapsed: group.collapsed,
            };
        });

        // 建立 Session 資料
        const timestamp = Date.now();
        const session = {
            id: timestamp.toString(),
            name: `Session ${formatDateTime(new Date(timestamp).toISOString())}`,
            createdAt: new Date(timestamp).toISOString(),
            totalTabs: 0,
            windows: [],
        };

        // 處理每個視窗（排除無痕模式）
        for (const win of normalWindows) {
            // ✨ 先解析 Lazy 分頁，還原成真實網址
            const resolvedTabs = win.tabs.map(resolveRealTabInfo);

            // 然後再進行有效性過濾（這時候 chrome-extension:// 已經變成真實網址了）
            const validTabs = resolvedTabs.filter((tab) => isValidUrl(tab.url));

            // 找出原本的聚焦分頁在過濾後的索引
            let activeTabIndex = 0;
            const originalActiveTab = win.tabs.find((tab) => tab.active);
            if (originalActiveTab) {
                // 使用 ID 來比對，因為 resolveRealTabInfo 不會改變 tab.id
                const activeIndex = validTabs.findIndex((tab) => tab.id === originalActiveTab.id);
                if (activeIndex !== -1) {
                    activeTabIndex = activeIndex;
                }
            }

            const tabs = validTabs.map((tab) => ({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: tab.title || '未命名',
                url: tab.url,
                favIconUrl: tab.favIconUrl || '',
                // 保存分頁群組資訊
                groupId: tab.groupId !== undefined && tab.groupId !== -1 ? tab.groupId : null,
                groupInfo:
                    tab.groupId !== undefined && tab.groupId !== -1 && groupMap[tab.groupId]
                        ? groupMap[tab.groupId]
                        : null,
            }));

            if (tabs.length > 0) {
                session.windows.push({
                    windowId: win.id,
                    // 保存視窗位置與大小
                    left: win.left,
                    top: win.top,
                    width: win.width,
                    height: win.height,
                    state: win.state, // 'normal', 'minimized', 'maximized', 'fullscreen'
                    activeTabIndex, // 保存聚焦分頁索引
                    tabs,
                });
                session.totalTabs += tabs.length;
            }
        }

        // 如果沒有有效分頁，回傳 null
        if (session.totalTabs === 0) {
            return null;
        }

        // 讀取現有 Sessions 並加入新的
        const existingSessions = await loadSessions();
        const updatedSessions = [session, ...existingSessions];

        // 儲存到 Chrome Storage
        await chrome.storage.local.set({ [STORAGE_KEY]: updatedSessions });

        return session;
    } catch (error) {
        console.error('保存 Session 失敗:', error);
        throw error;
    }
};

/**
 * 更新 Session（用於編輯名稱或刪除分頁）
 * @param {Object} updatedSession - 更新後的 Session 物件
 * @returns {Promise<boolean>} 是否成功
 */
export const updateSession = async (updatedSession) => {
    try {
        const sessions = await loadSessions();
        const index = sessions.findIndex((s) => s.id === updatedSession.id);
        if (index !== -1) {
            // 重新計算總分頁數
            updatedSession.totalTabs = updatedSession.windows.reduce((sum, win) => sum + win.tabs.length, 0);
            sessions[index] = updatedSession;
            await chrome.storage.local.set({ [STORAGE_KEY]: sessions });
            return true;
        }
        return false;
    } catch (error) {
        console.error('更新 Session 失敗:', error);
        return false;
    }
};

/**
 * 刪除單一 Session（自動加入最近刪除清單）
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} 是否成功
 */
export const deleteSession = async (sessionId) => {
    try {
        const sessions = await loadSessions();
        const sessionToDelete = sessions.find((s) => s.id === sessionId);
        if (sessionToDelete) {
            await addToDeletedSessions(sessionToDelete);
        }
        const updatedSessions = sessions.filter((s) => s.id !== sessionId);
        await chrome.storage.local.set({ [STORAGE_KEY]: updatedSessions });
        return true;
    } catch (error) {
        console.error('刪除 Session 失敗:', error);
        return false;
    }
};

/**
 * 覆蓋更新 Session（使用目前所有視窗覆蓋指定 Session）
 * @param {string} sessionId - 要覆蓋的 Session ID
 * @param {string} sessionName - 保留的 Session 名稱
 * @returns {Promise<Object|null>} 更新後的 Session 物件
 */
export const overwriteSession = async (sessionId, sessionName) => {
    try {
        // 取得所有視窗
        const windows = await chrome.windows.getAll({ populate: true });

        // 過濾掉無痕模式視窗
        const normalWindows = windows.filter((win) => !win.incognito);

        // 取得所有分頁群組資訊
        let tabGroups = [];
        try {
            tabGroups = await chrome.tabGroups.query({});
        } catch (_e) {
            // tabGroups API 可能不支援
        }

        // 建立群組 ID 對應表
        const groupMap = {};
        tabGroups.forEach((group) => {
            groupMap[group.id] = {
                title: group.title || '',
                color: group.color,
                collapsed: group.collapsed,
            };
        });

        // 建立更新的 Session 資料
        const updatedSession = {
            id: sessionId,
            name: sessionName,
            createdAt: new Date().toISOString(), // 保留原始建立時間可選，這裡選擇更新
            updatedAt: new Date().toISOString(),
            totalTabs: 0,
            windows: [],
        };

        // 處理每個視窗
        for (const win of normalWindows) {
            // ✨ 先解析 Lazy 分頁，還原成真實網址
            const resolvedTabs = win.tabs.map(resolveRealTabInfo);

            // 然後再進行有效性過濾
            const validTabs = resolvedTabs.filter((tab) => isValidUrl(tab.url));

            // 找出原本的聚焦分頁在過濾後的索引
            let activeTabIndex = 0;
            const originalActiveTab = win.tabs.find((tab) => tab.active);
            if (originalActiveTab) {
                // 使用 ID 來比對
                const activeIndex = validTabs.findIndex((tab) => tab.id === originalActiveTab.id);
                if (activeIndex !== -1) {
                    activeTabIndex = activeIndex;
                }
            }

            const tabs = validTabs.map((tab) => ({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: tab.title || '未命名',
                url: tab.url,
                favIconUrl: tab.favIconUrl || '',
                groupId: tab.groupId !== undefined && tab.groupId !== -1 ? tab.groupId : null,
                groupInfo:
                    tab.groupId !== undefined && tab.groupId !== -1 && groupMap[tab.groupId]
                        ? groupMap[tab.groupId]
                        : null,
            }));

            if (tabs.length > 0) {
                updatedSession.windows.push({
                    windowId: win.id,
                    left: win.left,
                    top: win.top,
                    width: win.width,
                    height: win.height,
                    state: win.state,
                    activeTabIndex, // 保存聚焦分頁索引
                    tabs,
                });
                updatedSession.totalTabs += tabs.length;
            }
        }

        if (updatedSession.totalTabs === 0) {
            return null;
        }

        // 更新 Sessions 列表
        const sessions = await loadSessions();
        const index = sessions.findIndex((s) => s.id === sessionId);
        if (index !== -1) {
            // 保留原始建立時間
            updatedSession.createdAt = sessions[index].createdAt;
            sessions[index] = updatedSession;
            await chrome.storage.local.set({ [STORAGE_KEY]: sessions });
            return updatedSession;
        }

        return null;
    } catch (error) {
        console.error('覆蓋更新 Session 失敗:', error);
        throw error;
    }
};

/**
 * 匯出所有 Sessions 為 JSON
 * @returns {Promise<string>} JSON 字串
 */
export const exportSessions = async () => {
    const sessions = await loadSessions();
    return JSON.stringify(
        {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            sessions,
        },
        null,
        2,
    );
};

/**
 * 匯入 Sessions（合併或覆蓋）
 * @param {string} jsonString - JSON 字串
 * @param {boolean} overwrite - 是否覆蓋現有資料
 * @returns {Promise<{success: boolean, imported: number, error?: string}>} 匯入結果
 */
export const importSessions = async (jsonString, overwrite = false) => {
    try {
        const data = JSON.parse(jsonString);

        if (!data.sessions || !Array.isArray(data.sessions)) {
            return { success: false, imported: 0, error: '無效的匯入格式' };
        }

        if (overwrite) {
            // 覆蓋模式：完全取代現有資料
            await chrome.storage.local.set({ [STORAGE_KEY]: data.sessions });
            return { success: true, imported: data.sessions.length };
        } else {
            // 合併模式：新增匯入的資料，保留現有資料
            const existingSessions = await loadSessions();
            const existingIds = new Set(existingSessions.map((s) => s.id));
            const newSessions = data.sessions.filter((s) => !existingIds.has(s.id));
            const mergedSessions = [...newSessions, ...existingSessions];
            await chrome.storage.local.set({ [STORAGE_KEY]: mergedSessions });
            return { success: true, imported: newSessions.length };
        }
    } catch (error) {
        console.error('匯入 Sessions 失敗:', error);
        return { success: false, imported: 0, error: error.message || '匯入失敗' };
    }
};

/**
 * 清空所有 Sessions（自動將現有紀錄加入最近刪除清單）
 * @returns {Promise<boolean>} 是否成功
 */
export const clearAllSessions = async () => {
    try {
        const sessions = await loadSessions();
        // 將現有 sessions 依序加入已刪除清單（保留最新 MAX_DELETED_SESSIONS 筆）
        if (sessions.length > 0) {
            const existingDeleted = await loadDeletedSessions();
            const combined = [...sessions, ...existingDeleted].slice(0, MAX_DELETED_SESSIONS);
            await chrome.storage.local.set({ [DELETED_STORAGE_KEY]: combined });
        }
        await chrome.storage.local.set({ [STORAGE_KEY]: [] });
        return true;
    } catch (error) {
        console.error('清空 Sessions 失敗:', error);
        return false;
    }
};

/**
 * 延遲函式
 * @param {number} ms - 延遲毫秒數
 */
/**
 * 恢復整個 Session
 * 使用 Chrome 原生 discarded: true 實現 Lazy Loading
 * @param {Object} session - Session 物件
 * @returns {Promise<{success: number, failed: number}>} 恢復結果統計
 */
export const restoreSession = async (session) => {
    let successCount = 0;
    let failedCount = 0;

    try {
        // 逐一恢復視窗（不需要延遲，因為使用 discarded: true）
        for (const win of session.windows) {
            try {
                await restoreWindow(win);
                successCount++;
            } catch (error) {
                console.error('恢復視窗失敗:', error);
                failedCount++;
                // 繼續恢復其他視窗
            }
        }

        return { success: successCount, failed: failedCount };
    } catch (error) {
        console.error('恢復 Session 失敗:', error);
        throw error;
    }
};

/**
 * 檢查視窗位置是否在可用螢幕範圍內
 * @param {number} left - 視窗左邊位置
 * @param {number} top - 視窗頂部位置
 * @param {number} width - 視窗寬度
 * @param {number} height - 視窗高度
 * @returns {Object} 調整後的位置，如果無法確定則返回 undefined
 */
const getValidWindowBounds = async (left, top, width, height) => {
    try {
        // 取得所有顯示器資訊
        const displays = await chrome.system.display.getInfo();

        if (!displays || displays.length === 0) {
            // 無法取得顯示器資訊，不指定位置讓系統決定
            return { usePosition: false };
        }

        // 檢查原始位置是否在任一顯示器範圍內
        for (const display of displays) {
            const bounds = display.workArea || display.bounds;
            // 檢查視窗左上角是否在此顯示器範圍內（允許一些彈性空間）
            if (
                left >= bounds.left - 100 &&
                left < bounds.left + bounds.width &&
                top >= bounds.top - 100 &&
                top < bounds.top + bounds.height
            ) {
                // 位置有效，但確保不會超出邊界太多
                return {
                    usePosition: true,
                    left: Math.max(bounds.left, Math.min(left, bounds.left + bounds.width - 100)),
                    top: Math.max(bounds.top, Math.min(top, bounds.top + bounds.height - 100)),
                    width: Math.min(width, bounds.width),
                    height: Math.min(height, bounds.height),
                };
            }
        }

        // 原始位置不在任何顯示器範圍內，使用主顯示器
        const primaryDisplay = displays.find((d) => d.isPrimary) || displays[0];
        const bounds = primaryDisplay.workArea || primaryDisplay.bounds;

        return {
            usePosition: true,
            left: bounds.left + 50,
            top: bounds.top + 50,
            width: Math.min(width || 1200, bounds.width - 100),
            height: Math.min(height || 800, bounds.height - 100),
        };
    } catch (_e) {
        // 取得顯示器資訊失敗，不指定位置
        return { usePosition: false };
    }
};

/**
 * 恢復單一視窗 (修正版)
 * 解決 Chrome 不支援 create 時直接 discard 的問題
 */
export const restoreWindow = async (win) => {
    try {
        if (!win.tabs || win.tabs.length === 0) return;

        // 1. 確保 activeTabIndex 有效
        let activeTabIndex = win.activeTabIndex;
        if (activeTabIndex === undefined || activeTabIndex < 0 || activeTabIndex >= win.tabs.length) {
            const foundIndex = win.tabs.findIndex(t => t.active);
            activeTabIndex = foundIndex !== -1 ? foundIndex : 0;
        }
        const activeTabInfo = win.tabs[activeTabIndex];

        // 2. 建立視窗 (只載入 Active 分頁)
        const validBounds = await getValidWindowBounds(win.left, win.top, win.width, win.height);
        const createOptions = {
            url: activeTabInfo.url, // 這裡只載入原本 active 的那一頁
            focused: true
        };

        if (validBounds.usePosition) {
            createOptions.left = validBounds.left;
            createOptions.top = validBounds.top;
            createOptions.width = validBounds.width;
            createOptions.height = validBounds.height;
        }

        const newWindow = await chrome.windows.create(createOptions);

        // 還原視窗狀態
        if (win.state === 'maximized' || win.state === 'fullscreen') {
            chrome.windows.update(newWindow.id, { state: win.state }).catch(() => {});
        }

        // 3. 準備群組 Map
        const groupMap = new Map();
        
        // 取得新視窗中唯一的那個分頁 (Active 分頁) 的 ID
        // 注意：chrome.windows.create 剛建立時，tabs 陣列通常只有一個分頁
        const firstTabId = newWindow.tabs[0].id;
        
        // 處理 Active 分頁的群組
        if (activeTabInfo.groupInfo) {
            const groupKey = JSON.stringify(activeTabInfo.groupInfo);
            try {
                const groupId = await chrome.tabs.group({ 
                    tabIds: [firstTabId], 
                    createProperties: { windowId: newWindow.id } 
                });
                await chrome.tabGroups.update(groupId, {
                    title: activeTabInfo.groupInfo.title,
                    color: activeTabInfo.groupInfo.color,
                    collapsed: false 
                });
                groupMap.set(groupKey, groupId);
            } catch (e) {
                console.error("Active Tab 群組還原失敗", e);
            }
        }

        // 4. 建立剩餘分頁（使用輕量化佔位頁面 Lazy Loading）
        for (let i = 0; i < win.tabs.length; i++) {
            // 跳過已經建立的 Active 分頁
            if (i === activeTabIndex) {
                continue;
            }

            const tabInfo = win.tabs[i];

            try {
                // ✨ 建構佔位 URL - 使用輕量化頁面，CPU 消耗為 0
                // 注意：要對參數進行 encodeURIComponent 編碼，避免網址格式錯誤
                const lazyUrl =
                    chrome.runtime.getURL('lazy.html') +
                    `?url=${encodeURIComponent(tabInfo.url)}` +
                    `&title=${encodeURIComponent(tabInfo.title || 'Loading...')}` +
                    `&favIconUrl=${encodeURIComponent(tabInfo.favIconUrl || '')}`;

                // 🔥 建立分頁（使用佔位頁面，不需要 discard）
                const newTab = await chrome.tabs.create({
                    windowId: newWindow.id,
                    url: lazyUrl, // 使用佔位頁面，幾乎不吃資源
                    index: i,
                    active: false, // 背景分頁
                });

                // 加入群組邏輯
                if (tabInfo.groupInfo) {
                    const groupKey = JSON.stringify(tabInfo.groupInfo);
                    let groupId = groupMap.get(groupKey);

                    try {
                        if (!groupId) {
                            // 建立新群組
                            groupId = await chrome.tabs.group({
                                tabIds: [newTab.id],
                                createProperties: { windowId: newWindow.id },
                            });
                            await chrome.tabGroups.update(groupId, {
                                title: tabInfo.groupInfo.title || '',
                                color: tabInfo.groupInfo.color || 'grey',
                                collapsed: false,
                            });
                            groupMap.set(groupKey, groupId);
                        } else {
                            // 加入現有群組
                            await chrome.tabs.group({
                                tabIds: [newTab.id],
                                groupId: groupId,
                            });
                        }
                    } catch (_e) {
                        // 群組操作失敗，忽略
                    }
                }
            } catch (error) {
                console.error(`建立分頁失敗 (index: ${i}):`, error);
                // 單一分頁失敗不影響其他分頁
            }
        }

        // 5. 最後處理群組收合
        for (const [key, groupId] of groupMap) {
            const info = JSON.parse(key);
            if (info.collapsed) {
                chrome.tabGroups.update(groupId, { collapsed: true }).catch(() => {});
            }
        }

    } catch (error) {
        console.error('恢復視窗失敗:', error);
        throw error;
    }
};
/**
 * 開啟單一分頁
 * @param {string} url - 分頁 URL
 */
export const openSingleTab = async (url) => {
    try {
        await chrome.tabs.create({ url });
    } catch (error) {
        console.error('開啟分頁失敗:', error);
        throw error;
    }
};

/**
 * 格式化日期時間
 * @param {string} isoString - ISO 格式的日期字串
 * @returns {string} 格式化後的字串
 */
export const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
