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

- **Instant Save**: Capture all tabs and groups across all open windows in milliseconds.
- **Zero-CPU Lazy Loading Architecture**:
  - Ultra-lightweight placeholder technology (< 4KB) prevents CPU/memory spikes even when restoring 200+ tabs.
  - Tabs load real content only when clicked/activated, saving memory and eliminating browser freezes.
  - Zero recovery latency: Tabs appear instantly in your tab bar.
- **Full Geometry & Group Restoration**:
  - Window Placement: Automatically restores original window dimensions, coordinates, and displays.
  - Tab Groups: Preserves native Chrome Tab Groups (names, colors, and order).
- **Flexible Restore Options**:
  - Restore All: One-click restoration of all windows and tabs.
  - Single Window Restore: Restore only a specific window and its tabs.
  - Single Tab Launch: Open individual pages directly from the list.
- **Recently Deleted Buffer**:
  - Built-in trash bin keeps your last 7 deleted records automatically (FIFO).
  - Eliminates fear of accidental deletions with one-click restore.
- **Dual Theme System**:
  - Classic Clean Light mode for everyday simplicity.
  - Raycast-inspired developer Dark mode with hairline borders and pure-black canvas.
- **Local-Only Privacy**:
  - 100% stored in local browser storage (`chrome.storage.local`), never sent to external servers.
  - Automatically excludes Incognito windows to protect private browsing.
- **Offline Data Management**:
  - In-place renaming and one-click overwrite with currently active tabs.
  - Standard JSON import/export (supports merge and replace modes) for easy backups.
- **Full Multi-language Support**:
  - English, Traditional Chinese, Japanese, Korean, and Simplified Chinese.

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
