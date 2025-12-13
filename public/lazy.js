
const params = new URLSearchParams(window.location.search);
const targetUrl = params.get('url');
const targetTitle = params.get('title');
const targetFavicon = params.get('favIconUrl');

// 2. 偽裝標題 (讓分頁在背景時看起來像原本的網頁)
if (targetTitle) {
    document.title = targetTitle;
}

// 3. 偽裝 Favicon (讓圖示看起來是對的)
if (targetFavicon) {
    // 移除現有的 icon (如果有的話)
    const existingLink = document.querySelector("link[rel*='icon']");
    if (existingLink) {
        document.head.removeChild(existingLink);
    }

    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = targetFavicon;
    document.getElementsByTagName('head')[0].appendChild(link);
} else if (targetUrl) {
    // 如果沒有圖示，嘗試使用 Google S2 服務抓取 (選用)
    try {
        const domain = new URL(targetUrl).hostname;
        const link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `https://www.google.com/s2/favicons?domain=${domain}`;
        document.getElementsByTagName('head')[0].appendChild(link);
    } catch (e) {
        // URL 解析失敗，忽略
    }
}

// 4. 顯示原本網址 (給使用者看，萬一沒轉址成功至少知道要去哪)
const urlDisplay = document.getElementById('urlDisplay');
if (urlDisplay && targetUrl) {
    urlDisplay.textContent = targetUrl;
}

// 5. 核心轉址邏輯
const loadRealPage = () => {
    if (targetUrl) {
        // 使用 replace，這樣使用者按「上一頁」不會回到這個 lazy 頁面
        window.location.replace(targetUrl);
    }
};

// 6. 監聽事件
// 當頁面被「聚焦 (Focus)」或「點擊」時，才載入
window.addEventListener('focus', loadRealPage);
window.addEventListener('click', loadRealPage);

// 雙重保險：如果一打開就是 Active 狀態 (document.hidden 為 false)，直接載入
if (!document.hidden) {
    loadRealPage();
}