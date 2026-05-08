# CLAUDE.md — subscription-manager

## [PROJECT MODE]
mode: exploratory

- 仮置きを許可
- 未確定要素は TODO として明示して進行する

---

## プロジェクト概要

個人用サブスクリプション管理ローカルWebアプリ。
Next.js dev server をローカルサーバーとして使用。

---

## 技術スタック

- Next.js (App Router) / TypeScript / Tailwind CSS
- データ永続化: localStorage
- 為替レート: frankfurter.app API（APIキー不要）
- 通知: Notification API（ブラウザ）

---

## ディレクトリ構成

```
src/
├── app/           # layout.tsx / page.tsx / globals.css
├── components/    # SubscriptionApp / Dashboard / FilterBar / List / Card / Modal
├── types/         # index.ts（型定義）
└── lib/           # storage.ts / exchange.ts / notifications.ts
```

---

## グローバルルールの除外

以下はこのプロジェクトには適用しない：

- [PRE-IMPLEMENTATION CHECK] テストケース定義（個人用UIツールのため）
- [ARCHITECTURE] Controller/Service/Repository分離（小規模ローカルアプリのため）
- [SECURITY] PIIマスキング（自分のデータのみ）
- [EXECUTION RULES] Rate Limit（frankfurter.appはAPIキー不要・24hキャッシュで対応）

---

## 維持するルール

- [CORE RULES] 最上位統治
- [SECURITY] 依存バージョン固定（latest禁止）
- [EXECUTION RULES] Timeout（外部API: 5秒）
- [SCOPE CONTROL] スコープ逸脱禁止
- [SYNC INTEGRITY] Context.md / Spec更新必須

---

## デザイン制約（my-hpから継承・変更禁止）

**カラーパレット（固定）:**

| 用途 | 値 |
|---|---|
| 背景 | `#f7f5f2` |
| メインテキスト | `#3a3734` |
| サブテキスト | `#7a7572` |
| リンク | `#6a6560` |
| キャプション | `#aaa49e` |
| タグ背景 | `#eceae6` |

**トーン:** 和モダン / ミニマル / 静かな余白
**タイポグラフィ:** font-light、tracking広め
**レイアウト:** 中央揃え、max-w-lg、余白広く

---

## 判断基準

1. 余白が増えるか？
2. 情報が減るか？
3. 静かに見えるか？

YES → 採用 / NO → 却下
