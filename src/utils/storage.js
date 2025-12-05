/**
 * Chrome Storage 工具函式
 * 處理 Session 的儲存、讀取、刪除操作
 */

// 儲存鍵名
const STORAGE_KEY = 'sessions';

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
            // 過濾掉無法開啟的特殊頁面
            const validTabs = win.tabs.filter((tab) => isValidUrl(tab.url));

            // 找出原本的聚焦分頁在過濾後的索引
            let activeTabIndex = 0;
            const originalActiveTab = win.tabs.find((tab) => tab.active);
            if (originalActiveTab && isValidUrl(originalActiveTab.url)) {
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
 * 刪除單一 Session
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} 是否成功
 */
export const deleteSession = async (sessionId) => {
    try {
        const sessions = await loadSessions();
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
            const validTabs = win.tabs.filter((tab) => isValidUrl(tab.url));

            // 找出原本的聚焦分頁在過濾後的索引
            let activeTabIndex = 0;
            const originalActiveTab = win.tabs.find((tab) => tab.active);
            if (originalActiveTab && isValidUrl(originalActiveTab.url)) {
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
 * 清空所有 Sessions
 * @returns {Promise<boolean>} 是否成功
 */
export const clearAllSessions = async () => {
    try {
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
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 計算 Session 的總分頁數
 * @param {Object} session - Session 物件
 * @returns {number} 總分頁數
 */
const getTotalTabCount = (session) => {
    return session.windows.reduce((total, win) => total + win.tabs.length, 0);
};

/**
 * 根據分頁數量決定延遲策略
 * - 少量 (< 50): 無延遲，維持極速
 * - 中等 (50-100): 輕度延遲
 * - 大量 (> 100): 完整延遲
 * @param {number} totalTabs - 總分頁數
 * @returns {Object} 延遲設定
 */
const getDelayStrategy = (totalTabs) => {
    if (totalTabs < 50) {
        // 少量分頁：極速模式，無延遲
        return {
            windowDelay: 0,
            batchSize: 0, // 0 表示不分批
            batchDelay: 0,
            tabDelay: 0,
        };
    } else if (totalTabs <= 100) {
        // 中等分頁：輕度延遲
        return {
            windowDelay: 200,
            batchSize: 10,
            batchDelay: 80,
            tabDelay: 0,
        };
    } else {
        // 大量分頁：完整延遲確保穩定
        return {
            windowDelay: 500,
            batchSize: 5,
            batchDelay: 150,
            tabDelay: 50,
        };
    }
};

/**
 * 恢復整個 Session（開啟所有視窗與分頁，還原位置和分頁群組）
 * 根據分頁數量動態調整延遲策略
 * @param {Object} session - Session 物件
 * @returns {Promise<{success: number, failed: number}>} 恢復結果統計
 */
export const restoreSession = async (session) => {
    let successCount = 0;
    let failedCount = 0;

    try {
        // 計算總分頁數，決定延遲策略
        const totalTabs = getTotalTabCount(session);
        const strategy = getDelayStrategy(totalTabs);

        // 逐一恢復視窗
        for (let i = 0; i < session.windows.length; i++) {
            const win = session.windows[i];
            try {
                await restoreWindow(win, strategy);
                successCount++;

                // 視窗之間延遲（如果策略需要）
                if (strategy.windowDelay > 0 && i < session.windows.length - 1) {
                    await delay(strategy.windowDelay);
                }
            } catch (error) {
                console.error(`恢復視窗 ${i + 1} 失敗:`, error);
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
 * 恢復單一視窗（開啟該視窗的所有分頁，還原位置和分頁群組）
 * 根據策略決定是否使用延遲
 * @param {Object} win - 視窗物件
 * @param {Object} strategy - 延遲策略（可選，預設為極速模式）
 */
export const restoreWindow = async (win, strategy = null) => {
    // 使用傳入的策略，若無則使用極速模式（無延遲）
    const { batchSize = 0, batchDelay = 0, tabDelay = 0 } = strategy || {};

    try {
        if (win.tabs.length === 0) return;

        // 檢查並調整視窗位置
        const validBounds = await getValidWindowBounds(win.left, win.top, win.width, win.height);

        // 建立新視窗的選項
        const createOptions = {
            url: win.tabs[0].url,
        };

        // 只有在位置有效時才指定位置
        if (validBounds.usePosition) {
            createOptions.left = validBounds.left;
            createOptions.top = validBounds.top;
            createOptions.width = validBounds.width;
            createOptions.height = validBounds.height;
        }

        // 如果有保存視窗狀態且不是 minimized，設定狀態
        if (win.state && win.state !== 'minimized' && win.state !== 'normal') {
            createOptions.state = win.state;
        }

        const newWindow = await chrome.windows.create(createOptions);

        // 用於追蹤已建立的群組 (groupInfo -> groupId)
        const groupMap = new Map();

        // 處理第一個分頁的群組
        if (win.tabs[0].groupInfo) {
            const groupKey = JSON.stringify(win.tabs[0].groupInfo);
            try {
                const groupId = await chrome.tabs.group({
                    tabIds: [newWindow.tabs[0].id],
                    createProperties: { windowId: newWindow.id },
                });
                await chrome.tabGroups.update(groupId, {
                    title: win.tabs[0].groupInfo.title || '',
                    color: win.tabs[0].groupInfo.color || 'grey',
                    collapsed: false,
                });
                groupMap.set(groupKey, groupId);
            } catch (_e) {
                // 群組建立失敗，忽略
            }
        }

        // 處理剩餘的分頁
        const remainingTabs = win.tabs.slice(1);

        // 根據策略決定是否分批處理
        const useBatching = batchSize > 0;
        const effectiveBatchSize = useBatching ? batchSize : remainingTabs.length;

        for (let batchStart = 0; batchStart < remainingTabs.length; batchStart += effectiveBatchSize) {
            const batch = remainingTabs.slice(batchStart, batchStart + effectiveBatchSize);

            // 處理這一批分頁
            for (let j = 0; j < batch.length; j++) {
                const tab = batch[j];
                const tabIndex = batchStart + j + 1; // 實際的分頁索引

                try {
                    // 建立分頁
                    const newTab = await chrome.tabs.create({
                        windowId: newWindow.id,
                        url: tab.url,
                        index: tabIndex,
                        active: false,
                    });

                    // 如果有群組資訊，加入群組
                    if (tab.groupInfo) {
                        const groupKey = JSON.stringify(tab.groupInfo);

                        try {
                            if (groupMap.has(groupKey)) {
                                await chrome.tabs.group({
                                    tabIds: [newTab.id],
                                    groupId: groupMap.get(groupKey),
                                });
                            } else {
                                const groupId = await chrome.tabs.group({
                                    tabIds: [newTab.id],
                                    createProperties: { windowId: newWindow.id },
                                });
                                await chrome.tabGroups.update(groupId, {
                                    title: tab.groupInfo.title || '',
                                    color: tab.groupInfo.color || 'grey',
                                    collapsed: false,
                                });
                                groupMap.set(groupKey, groupId);
                            }
                        } catch (_e) {
                            // 群組操作失敗，忽略
                        }
                    }

                    // 單一分頁之間的延遲（僅在策略需要時）
                    if (tabDelay > 0 && j < batch.length - 1) {
                        await delay(tabDelay);
                    }
                } catch (error) {
                    console.error(`建立分頁失敗 (index: ${tabIndex}):`, error);
                    // 單一分頁失敗不影響其他分頁
                }
            }

            // 批次之間的延遲（僅在策略需要時）
            if (useBatching && batchDelay > 0 && batchStart + effectiveBatchSize < remainingTabs.length) {
                await delay(batchDelay);
            }
        }

        // 最後處理群組的收合狀態
        for (let i = 0; i < win.tabs.length; i++) {
            const tab = win.tabs[i];
            if (tab.groupInfo && tab.groupInfo.collapsed) {
                const groupKey = JSON.stringify(tab.groupInfo);
                const groupId = groupMap.get(groupKey);
                if (groupId) {
                    try {
                        await chrome.tabGroups.update(groupId, { collapsed: true });
                    } catch (_e) {
                        // 忽略
                    }
                }
            }
        }

        // 恢復聚焦分頁：切換到保存時的活動分頁
        if (win.activeTabIndex !== undefined && win.activeTabIndex >= 0) {
            try {
                const windowTabs = await chrome.tabs.query({ windowId: newWindow.id });
                if (windowTabs.length > win.activeTabIndex) {
                    await chrome.tabs.update(windowTabs[win.activeTabIndex].id, { active: true });
                }
            } catch (_e) {
                // 聚焦失敗，忽略
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
