/**
 * Chrome Storage 工具函式
 * 處理 Session 的儲存、讀取、刪除操作
 */

// 儲存鍵名
const STORAGE_KEY = 'sessions';

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
    tabGroups.forEach(group => {
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

    // 處理每個視窗
    for (const win of windows) {
      // 過濾掉擴充功能頁面和空分頁
      const tabs = win.tabs
        .filter(tab => tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://'))
        .map(tab => ({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: tab.title || '未命名',
          url: tab.url,
          favIconUrl: tab.favIconUrl || '',
          // 保存分頁群組資訊
          groupId: tab.groupId !== undefined && tab.groupId !== -1 ? tab.groupId : null,
          groupInfo: tab.groupId !== undefined && tab.groupId !== -1 && groupMap[tab.groupId] 
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
    const index = sessions.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
      // 重新計算總分頁數
      updatedSession.totalTabs = updatedSession.windows.reduce(
        (sum, win) => sum + win.tabs.length, 0
      );
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
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    await chrome.storage.local.set({ [STORAGE_KEY]: updatedSessions });
    return true;
  } catch (error) {
    console.error('刪除 Session 失敗:', error);
    return false;
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
 * 恢復整個 Session（開啟所有視窗與分頁，還原位置和分頁群組）
 * @param {Object} session - Session 物件
 */
export const restoreSession = async (session) => {
  try {
    for (const win of session.windows) {
      await restoreWindow(win);
    }
  } catch (error) {
    console.error('恢復 Session 失敗:', error);
    throw error;
  }
};

/**
 * 恢復單一視窗（開啟該視窗的所有分頁，還原位置和分頁群組）
 * @param {Object} win - 視窗物件
 */
export const restoreWindow = async (win) => {
  try {
    const urls = win.tabs.map(tab => tab.url);
    
    if (urls.length === 0) return;

    // 建立新視窗並設定位置與大小
    const createOptions = {
      url: urls[0],
      left: win.left,
      top: win.top,
      width: win.width,
      height: win.height,
    };

    // 如果有保存視窗狀態且不是 minimized，設定狀態
    if (win.state && win.state !== 'minimized') {
      createOptions.state = win.state;
    }

    const newWindow = await chrome.windows.create(createOptions);
    
    // 儲存新建立的分頁 ID 對應
    const createdTabs = [{ tabId: newWindow.tabs[0].id, originalTab: win.tabs[0] }];
    
    // 開啟剩餘的分頁
    for (let i = 1; i < urls.length; i++) {
      const newTab = await chrome.tabs.create({
        windowId: newWindow.id,
        url: urls[i],
      });
      createdTabs.push({ tabId: newTab.id, originalTab: win.tabs[i] });
    }

    // 還原分頁群組
    await restoreTabGroups(createdTabs);
    
  } catch (error) {
    console.error('恢復視窗失敗:', error);
    throw error;
  }
};

/**
 * 還原分頁群組
 * @param {Array} createdTabs - 已建立的分頁對應陣列
 */
const restoreTabGroups = async (createdTabs) => {
  try {
    // 收集需要分組的分頁，按原始 groupId 分類
    const groupsToCreate = {};
    
    for (const { tabId, originalTab } of createdTabs) {
      if (originalTab.groupInfo) {
        const groupKey = JSON.stringify(originalTab.groupInfo);
        if (!groupsToCreate[groupKey]) {
          groupsToCreate[groupKey] = {
            info: originalTab.groupInfo,
            tabIds: [],
          };
        }
        groupsToCreate[groupKey].tabIds.push(tabId);
      }
    }

    // 建立分頁群組
    for (const groupKey of Object.keys(groupsToCreate)) {
      const { info, tabIds } = groupsToCreate[groupKey];
      
      if (tabIds.length > 0) {
        try {
          // 將分頁加入群組
          const groupId = await chrome.tabs.group({ tabIds });
          
          // 設定群組屬性
          await chrome.tabGroups.update(groupId, {
            title: info.title || '',
            color: info.color || 'grey',
            collapsed: info.collapsed || false,
          });
        } catch (e) {
          console.log('建立分頁群組失敗:', e);
        }
      }
    }
  } catch (error) {
    console.log('還原分頁群組失敗:', error);
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
