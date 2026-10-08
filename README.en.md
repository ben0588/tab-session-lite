<p align="right">
  <a href="./README.md">繁體中文</a> | <strong>English</strong> | <a href="./README.ja.md">日本語</a> | <a href="./README.ko.md">한국어</a> | <a href="./README.zh-Hans.md">简体中文</a>
</p>

# Tab Session Lite - Fast & Lightweight Tab Session Manager

Ultra-lightweight, performance-first Chrome extension for managing tab sessions.

**Core Value: Instant Save, Zero CPU, Local Only.**

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/pdfabpgjkeplngckadhocdioamjbdpdf?label=Version&logo=google-chrome)](https://chromewebstore.google.com/detail/tab-session-lite/pdfabpgjkeplngckadhocdioamjbdpdf)

## Features

- 🚀 **Instant Save**: Capture all tabs across all open windows in a single click.
- 📋 **Session History**: View saved sessions organized chronologically.
- 🔄 **Flexible Restore**:
  - Restore All: One-click restoration of all windows and tabs.
  - Single Window Restore: Restore only a specific window and its tabs.
  - Single Tab Launch: Open individual pages directly from the list.
- 📍 **Full Geometry & Group Restoration**:
  - Window Placement: Automatically restores original window dimensions and coordinates.
  - Tab Groups: Preserves tab group names, colors, and order.
- ✏️ **Custom Management**:
  - Rename sessions for quick identification.
  - Overwrite sessions: Update an existing record with current active tabs.
  - Granular deletion: Delete individual tabs, specific windows, or entire sessions.
  - Clear all records when needed.
- 📦 **Export / Import**: JSON-based backup and cross-device migration.
- 🔒 **Privacy & Security**:
  - Stored strictly in local browser storage (`chrome.storage.local`), never sent to external servers.
  - Automatically excludes Incognito windows.
- ⚡ **Zero-CPU Lazy Loading Architecture**:
  - Ultra-lightweight placeholder technology (< 4KB) prevents CPU/memory spikes even when restoring 200+ tabs.
  - Tabs load real content only when clicked/activated.
  - Zero recovery latency: Tabs appear instantly in your tab bar.
- 🌐 **Multi-language Support**: Traditional Chinese, English, Japanese, Korean, and Simplified Chinese.

## Tech Stack

- **Framework**: React 19 + Vite 5
- **Styling**: Tailwind CSS 3.x (Raycast Dark Aesthetic)
- **Extension Engine**: @crxjs/vite-plugin + Manifest V3
- **Internationalization**: react-i18next + i18next
- **Storage**: chrome.storage.local

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (with HMR)
npm run dev

# Production build
npm run build

# Generate icons
npm run icons
```

## How to Install in Developer Mode

1. Run `npm run build` to generate the `dist` folder.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `dist` folder.

## License

[MIT](./LICENSE) © ben0588
