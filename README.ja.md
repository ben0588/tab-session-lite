<p align="right">
  <a href="./README.md">繁體中文</a> | <a href="./README.en.md">English</a> | <strong>日本語</strong> | <a href="./README.ko.md">한국어</a> | <a href="./README.zh-Hans.md">简体中文</a>
</p>

# Tab Session Lite - 超軽量・高速タブセッションマネージャー

極めて軽量で、速度とパフォーマンスを最優先にした Chrome タブセッション管理拡張機能です。

**コアバリュー: Instant Save, Zero CPU, Local Only.**

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/pdfabpgjkeplngckadhocdioamjbdpdf?label=Version&logo=google-chrome)](https://chromewebstore.google.com/detail/tab-session-lite/pdfabpgjkeplngckadhocdioamjbdpdf)

## 主な機能

- 🚀 **ワンクリック即時保存**: 開いているすべてのウィンドウのすべてのタブを一瞬で保存
- 📋 **履歴リスト**: 保存日時順に整理されたセッション一覧を表示
- 🔄 **柔軟な復元機能**:
  - すべて復元: すべてのウィンドウとタブをワンクリックで復元
  - 単一ウィンドウ復元: 特定のウィンドウとそのタブのみを復元
  - 単一タブを開く: リストから特定のページを直接開く
- 📍 **完全な状態復元**:
  - ウィンドウ位置の復元: 元のウィンドウサイズと画面座標を自動復元
  - タブグループの復元: グループ名、色、並び順を完全に維持
- ✏️ **カスタム管理**:
  - セッション名を編集して整理しやすく管理
  - 記録の更新: 現在開いているタブで既存のセッションを上書き
  - 柔軟な削除: 単一タブ、特定ウィンドウ、またはセッション全体を削除
  - 必要に応じてすべての記録を一括消去
- 📦 **エクスポート / インポート**: JSON 形式でのバックアップとデータ移行に対応
- 🔒 **プライバシーとセキュリティ**:
  - データはブラウザのローカルストレージ (`chrome.storage.local`) のみに保存され、外部サーバーには一切送信されません
  - シークレットウィンドウ (Incognito) は自動的に除外
- ⚡ **Zero-CPU Lazy Loading アーキテクチャ**:
  - 4KB 未満の超軽量プレースホルダー技術により、200 以上のタブを復元しても CPU やメモリの負荷がゼロ
  - 実際にクリックしてアクティブにしたタブのみが本来のページを読み込み
  - 遅延なし: タブバーにすべてのタブが一瞬で並びます
- 🌐 **多言語対応**: 繁体字中国語、英語、日本語、韓国語、簡体字中国語

## 技術スタック

- **フレームワーク**: React 19 + Vite 5
- **スタイリング**: Tailwind CSS 3.x (Raycast Dark スタイル)
- **拡張機能エンジン**: @crxjs/vite-plugin + Manifest V3
- **多言語対応**: react-i18next + i18next
- **ストレージ**: chrome.storage.local

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発モード (HMR 対応)
npm run dev

# プロダクションビルド
npm run build

# アイコン生成
npm run icons
```

## デベロッパーモードでのインストール手順

1. `npm run build` を実行して `dist` フォルダを生成します。
2. Chrome ブラウザで `chrome://extensions/` を開きます。
3. 右上の **デベロッパーモード** を有効にします。
4. **パッケージ化されていない拡張機能を読み込む** をクリックし、`dist` フォルダを選択します。

## ライセンス

[MIT](./LICENSE) © ben0588
