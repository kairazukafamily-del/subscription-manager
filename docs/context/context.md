# Context.md — subscription-manager

## 現在のフェーズ

**Phase 1: 実装完了・GitHub公開済み**

## プロジェクトモード

exploratory（仮置き許可・TODO明示）

---

## 確定済み

| 項目 | 内容 |
|---|---|
| プロジェクト名 | subscription-manager |
| ディレクトリ | `/Users/kairazukahideaki/projects/subscription-manager` |
| スタック | Next.js 16.2.4 (App Router) / TypeScript / Tailwind CSS v4 |
| データ永続化 | localStorage |
| 為替API | frankfurter.app（サーバーサイドプロキシ `/api/rate`・24hキャッシュ） |
| 為替フォールバック | cdn.jsdelivr.net/@fawazahmed0/currency-api |
| 通知 | Notification API（ブラウザ）/ 1日1回チェック |
| 状態管理 | アクティブ / 停止中（解約済みは不採用） |
| カテゴリ | デフォルト6種 + カスタム追加・編集・削除 |
| 周期 | 月額のみ |
| デザイン | my-hp継承（#f7f5f2 / 和モダン / ミニマル）|
| GitHubリポジトリ | https://github.com/kairazukafamily-del/subscription-manager（公開）|

---

## 完了済み作業

- [x] プロジェクト初期化（Next.js 16.2.4）
- [x] CLAUDE.md 作成
- [x] Spec 作成
- [x] 型定義（src/types/index.ts）
- [x] localStorage層（src/lib/storage.ts）
- [x] 為替レートfetch（src/lib/exchange.ts）
- [x] 為替レートAPIプロキシ（src/app/api/rate/route.ts）
- [x] 通知ロジック（src/lib/notifications.ts）
- [x] コンポーネント実装（Dashboard / FilterBar / Card / List / Modal / App）
- [x] カテゴリ管理モーダル（CategoryModal.tsx）
- [x] globals.css（my-hpカラー適用）
- [x] layout.tsx（メタデータ更新）
- [x] 動作確認済み（npm run dev）
- [x] TypeScript型チェック通過確認
- [x] GitHubプライベートリポジトリに公開

---

## Decision Log

- 2026-05-08: localStorage採用（DBセットアップ不要、個人用ローカルツールのため）
- 2026-05-08: frankfurter.app採用（APIキー不要、個人用途に最適）
- 2026-05-08: 月額のみ（年額なし、シンプル化）
- 2026-05-08: 通知は1日1回チェック（lastNotifyDateで管理、起動毎の重複通知を防止）
- 2026-05-08: 為替APIをサーバーサイドプロキシ経由に変更（クライアントから直接叩くとNext.jsのfetchキャッシュやCORSで失敗するケースがあったため）
- 2026-05-08: CDNフォールバック追加（frankfurter.app障害時の可用性確保）
- 2026-05-08: 状態を「アクティブ / 停止中」の2値に確定（解約済みは運用上不要と判断）
- 2026-05-08: カテゴリ管理UIをカード詳細から独立したモーダルに分離（フィルタ行「編集」ボタン起動）
- 2026-05-08: GitHubプライベートリポジトリに公開（kairazukafamily-del/subscription-manager）

---

## このファイルの役割

- インデックスとして使用する
- 詳細は各分割ファイルに記述する
- 内容の重複を禁止する

## ファイル一覧

| ファイル | 責務 |
|---|---|
| subscriptions/billing.md | 課金・通貨・為替 |
| subscriptions/lifecycle.md | 状態管理・通知・カテゴリ |
| subscriptions/project.md | 技術構成・設計 |
| subscriptions/meta.md | フェーズ・進行状況 |

## 読み込みルール

### 基本
- 必要なファイルのみ読み込む

### ケース別

| ケース | 読み込むファイル |
|---|---|
| UI / 状態管理 | lifecycle.md |
| 課金 / 通貨 | billing.md |
| 技術構成確認 | project.md |
| 進行確認 | meta.md |

### 例外
- 全体把握が必要な場合のみ全ファイルを読み込む
