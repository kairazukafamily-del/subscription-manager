# Context.md — subscription-manager

## 現在のフェーズ

**Phase 1: 実装完了・動作確認中**

## プロジェクトモード

exploratory（仮置き許可・TODO明示）

---

## 確定済み

| 項目 | 内容 |
|---|---|
| プロジェクト名 | subscription-manager |
| ディレクトリ | `/Users/kairazukahideaki/projects/subscription-manager` |
| スタック | Next.js (App Router) / TypeScript / Tailwind CSS |
| データ永続化 | localStorage |
| 為替API | frankfurter.app（APIキー不要・24hキャッシュ） |
| 通知 | Notification API（ブラウザ）/ 1日1回チェック |
| 状態管理 | アクティブ / 停止中 / 解約済み |
| カテゴリ | デフォルト6種 + カスタム追加可 |
| 周期 | 月額のみ |
| デザイン | my-hp継承（#f7f5f2 / 和モダン / ミニマル）|

---

## 完了済み作業

- [x] プロジェクト初期化（Next.js 16.2.4）
- [x] CLAUDE.md 作成
- [x] Spec 作成
- [x] 型定義（src/types/index.ts）
- [x] localStorage層（src/lib/storage.ts）
- [x] 為替レートfetch（src/lib/exchange.ts）
- [x] 通知ロジック（src/lib/notifications.ts）
- [x] コンポーネント実装（Dashboard / FilterBar / Card / List / Modal / App）
- [x] globals.css（my-hpカラー適用）
- [x] layout.tsx（メタデータ更新）

## 未着手

- [ ] 動作確認（npm run dev）
- [ ] TypeScript型チェック通過確認

---

## Decision Log

- 2026-05-08: localStorage採用（DBセットアップ不要、個人用ローカルツールのため）
- 2026-05-08: frankfurter.app採用（APIキー不要、個人用途に最適）
- 2026-05-08: 月額のみ（年額なし、シンプル化）
- 2026-05-08: 通知は1日1回チェック（lastNotifyDateで管理、起動毎の重複通知を防止）
