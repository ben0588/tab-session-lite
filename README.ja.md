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

- **ワンクリック即時保存 (Instant Save)**: 開いているすべてのウィンドウ・タブ・グループを一瞬で保存。
- **Zero-CPU Lazy Loading アーキテクチャ**:
  - 4KB 未満の超軽量プレースホルダー技術により、200 以上のタブを復元しても CPU やメモリの急上昇がゼロ。
  - 実際にクリックしてアクティブにしたタブのみが本来のページを読み込み、メモリ消費を最小限に抑制。
  - 遅延なし: タブバーにすべてのタブが一瞬で並びます。
- **完全な状態復元 (Full Fidelity)**:
  - ウィンドウ位置の復元: 元のウィンドウサイズ、画面座標、ディスプレイ配置を自動復元。
  - タブグループの復元: Chrome ネイティブのタブグループ（色・タイトル・並び順）を完全維持。
- **柔軟な復元機能**:
  - すべて復元: すべてのウィンドウとタブをワンクリックで復元。
  - 単一ウィンドウ復元: 特定のウィンドウとそのタブのみを復元。
  - 単一タブを開く: リストから特定のページを直接開く。
- **「最近の削除」バッファ (Recently Deleted Buffer)**:
  - 直近 7 件の削除履歴を自動保持（先入れ先出し）。
  - 誤って削除した場合も、ワンクリックで安全にメインリストへ救出可能。
- **デュアルテーマシステム (Dual Theme System)**:
  - クラシック・ライト: 爽やかで親しみやすい標準スタイル。
  - Raycast 風ダーク: 純黒のキャンバスと 1px ヘアライン境界線による開発者向け極上ダークモード。
- **プライバシー保護 (Local-Only Architecture)**:
  - データは 100% ブラウザのローカル (`chrome.storage.local`) のみに保存され、外部サーバーには一切送信されません。
  - シークレットウィンドウ (Incognito) は自動的に除外。
- **オフラインデータ管理**:
  - リスト上で名前を直接編集、現在開いているタブでのワンクリック上書き更新。
  - JSON 形式でのバックアップ（統合または置換モード）と安全な端末間移行に対応。
- **多言語完全対応**:
  - 日本語、繁体字中国語、英語、韓国語、簡体字中国語。

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
