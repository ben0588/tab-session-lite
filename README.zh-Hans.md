<p align="right">
  <a href="./README.md">繁體中文</a> | <a href="./README.en.md">English</a> | <a href="./README.ja.md">日本語</a> | <a href="./README.ko.md">한국어</a> | <strong>简体中文</strong>
</p>

# Tab Session Lite - 标签页管理与一键保存

极致轻量、速度优先的 Chrome 标签页 Session 管理扩展。

**核心价值：Instant Save, Zero CPU, Local Only.**

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/pdfabpgjkeplngckadhocdioamjbdpdf?label=Version&logo=google-chrome)](https://chromewebstore.google.com/detail/tab-session-lite/pdfabpgjkeplngckadhocdioamjbdpdf)

## 功能特色

- **一键秒存 (Instant Save)**：毫秒级瞬间快照所有窗口与标签页分组，操作顺畅无感。
- **极致性能 (Zero CPU Lazy Loading)**：
  - 采用轻量化占位页面机制（< 4KB），一次恢复 200+ 标签页亦零 CPU 负担。
  - 只有点击激活的标签页才会真正加载网页内容，彻底告别内存飙高与浏览器崩溃。
  - 标签栏瞬间完全展开，移除所有多余的延迟等待。
- **高保真完整还原 (Full Fidelity)**：
  - 窗口几何还原：自动保留并还原窗口的屏幕坐标、宽高尺寸与显示器布局。
  - 标签页分组还原：完整保留 Chrome 原生 Tab Groups 的名称、颜色标记与排列顺序。
- **弹性恢复机制**：
  - 全部恢复：一键还原跨窗口所有内容。
  - 单一窗口还原：仅恢复特定窗口及其标签页。
  - 单一标签页开启：直接点击特定链接打开独立页面。
- **最近删除安全缓冲 (Recently Deleted Buffer)**：
  - 内置回收暂存区，自动保留最近 7 条删除记录（先进先出）。
  - 防止手滑误删，支持一键即时找回并恢复至主列表。
- **双主题系统 (Dual Theme System)**：
  - 经典亮色 (Classic Light)：清爽简洁的经典视窗风格。
  - 极客暗黑 (Raycast Dark)：纯黑画布与 1px hairline 细框的沉浸式极客美学。
- **本地隐私保护 (Local-Only Architecture)**：
  - 所有标签页数据与设置 100% 仅存储于本地 `chrome.storage.local`，严禁上传任何云端服务器。
  - 自动排除无痕模式（Incognito）窗口，守护用户隐私。
- **离线数据管理**：
  - 就地重命名：点击名称即可就地修改，支持用当前打开标签页一键覆盖更新。
  - 支持标准 JSON 格式导出与导入（可选合并现有或完全替换），方便跨设备迁移。
- **完整多语言支持**：
  - 简体中文、繁体中文、English、日本語、한국어。

## 技术架构

- **框架**: React 19 + Vite 5
- **样式**: Tailwind CSS 3.x (Raycast 极客暗色美学)
- **扩展构建**: @crxjs/vite-plugin + Manifest V3
- **多语言**: react-i18next + i18next
- **存储**: chrome.storage.local

## 开发指令

```bash
# 安装依赖
npm install

# 开发模式（支持 HMR）
npm run dev

# 构建生产版本
npm run build

# 生成图标
npm run icons
```

## 开发者模式安装

1. 运行 `npm run build` 生成 `dist` 目录。
2. 在 Chrome 中打开 `chrome://extensions/`。
3. 开启右上角 **开发者模式**。
4. 点击 **加载已解压的扩展程序** 并选择 `dist` 目录。

## 开源协议

[MIT](./LICENSE) © ben0588
