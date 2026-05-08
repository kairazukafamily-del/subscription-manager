# CLAUDE.md — subscription-manager

## [PROJECT MODE]
mode: exploratory

- 仮置きを許可
- 未確定要素は TODO として明示して進行する

---

## プロジェクト概要

個人用サブスクリプション管理ローカルWebアプリ。
Next.js dev server をローカルサーバーとして使用。

**GitHub:** https://github.com/kairazukafamily-del/subscription-manager（公開）

---

## 起動方法

```bash
cd ~/projects/subscription-manager
npm run dev
# http://localhost:3000 で起動
```

---

## 技術スタック

- Next.js 16.2.4 (App Router) / TypeScript / Tailwind CSS v4
- データ永続化: localStorage（DBなし）
- 為替レート: /api/rate（サーバーサイドプロキシ）→ frankfurter.app → jsdelivr CDN fallback
- 通知: Notification API（ブラウザ）

---

## ディレクトリ構成

```
src/
├── app/
│   ├── api/rate/route.ts   # 為替レートAPIプロキシ（frankfurter.app + CDN fallback）
│   ├── globals.css          # my-hpカラーパレット / フォント設定
│   ├── layout.tsx           # メタデータ
│   └── page.tsx             # SubscriptionApp をレンダリング
├── components/
│   ├── SubscriptionApp.tsx  # Root: 全状態管理・フィルタロジック
│   ├── Dashboard.tsx        # 月間合計・USD/JPYレート表示
│   ├── FilterBar.tsx        # ステータス/カテゴリフィルタ
│   ├── SubscriptionList.tsx # カード一覧
│   ├── SubscriptionCard.tsx # サービスカード（クリックで編集）
│   ├── SubscriptionModal.tsx # 追加/編集モーダル
│   └── CategoryModal.tsx    # カテゴリ管理モーダル
├── types/
│   └── index.ts             # Subscription / Category / ExchangeRateCache / RateInfo
└── lib/
    ├── storage.ts            # localStorage CRUD（キープレフィックス: subsc_v1_）
    ├── exchange.ts           # 為替レートfetch・キャッシュ・toJpy変換
    └── notifications.ts      # ブラウザ通知チェック（1日1回）
docs/
├── Spec_subscription-manager.md
└── Context.md
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
| ボーダー | `#e8e5e1` |
| 薄いアクセント | `#c0bbb6` |

**トーン:** 和モダン / ミニマル / 静かな余白
**タイポグラフィ:** font-light、tracking広め
**レイアウト:** 中央揃え、max-w-lg、余白広く

---

## 判断基準

1. 余白が増えるか？
2. 情報が減るか？
3. 静かに見えるか？

YES → 採用 / NO → 却下
