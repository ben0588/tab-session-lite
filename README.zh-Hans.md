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

- 🚀 **一键保存**：瞬间抓取所有窗口的所有标签页
- 📋 **历史列表**：依时间倒序显示已保存的 Session
- 🔄 **弹性恢复**：
  - 全部恢复：一键还原所有窗口与标签页
  - 单一窗口恢复：只恢复特定窗口及其标签页
  - 单一标签页开启：点击特定链接直接打开单个页面
- 📍 **完整还原**：
  - 窗口位置还原：恢复时自动还原窗口的原始位置与大小
  - 标签页群组还原：保留标签页群组的名称、颜色与排列顺序
- ✏️ **自定义管理**：
  - 编辑 Session 名称，方便辨识与整理
  - 更新记录：用目前标签页覆盖现有 Session
  - 颗粒度删除：删除单标签页、整个窗口或整个 Session
  - 一键清空所有记录
- 📦 **导出 / 导入**：支持 JSON 格式备份与还原
- 🔒 **隐私安全**：
  - 数据仅存储于浏览器本地（`chrome.storage.local`），不传输至任何外部服务器
  - 自动排除无痕模式窗口
- ⚡ **极致性能优化 (Zero CPU Lazy Loading)**：
  - 采用轻量化占位页面技术（< 4KB），恢复 200+ 标签页也能瞬间完成
  - 只有点击激活的标签页才会真正加载，CPU 与内存消耗趋近于零
  - 无延迟恢复：所有标签页瞬间出现在标签栏
- 🌐 **多语言支持**：繁体中文、English、日本語、한국어、简体中文

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
