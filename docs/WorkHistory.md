# WorkHistory.md — subscription-manager

作業日: 2026-05-08

---

## セッション概要

個人用サブスクリプション管理ローカルWebアプリを、my-hpのデザインシステムを継承してゼロから実装した。

---

## 実施内容（時系列）

### 1. プロジェクト設計・Spec策定

- my-hp の Spec / Context / CLAUDE.md を読み込み、デザインシステムを確認
- グローバル CLAUDE.md の統治ルールを確認
- [BLOCKED BY SPEC COMPLETENESS] プロトコルで未確定要素を全件列挙してユーザーに確認
- 確定した仕様:
  - 月額サービスのみ（年額なし）
  - 為替レート: frankfurter.app（APIキー不要）自動取得・24hキャッシュ
  - 通知タイミング: ユーザーが選択（通知なし/1/3/5/7/14/30日前）
  - 通知種別: ブラウザ Notification API
  - データ: localStorage（DBなし）
  - 状態: アクティブ / 停止中（解約済みは不採用）
  - カテゴリ: デフォルト6種 + カスタム追加・編集・削除

### 2. プロジェクト初期化

```bash
npx create-next-app@latest subscription-manager \
  --typescript --tailwind --app --src-dir \
  --no-eslint --import-alias "@/*"
```

### 3. 型定義（src/types/index.ts）

- `Subscription` / `Category` / `ExchangeRateCache` / `RateInfo` 型を定義
- `ServiceStatus = 'active' | 'paused'`（cancelled は不採用）
- `Currency = 'JPY' | 'USD'`

### 4. localStorage層（src/lib/storage.ts）

- キープレフィックス: `subsc_v1_`
- CRUD関数: getSubscriptions / saveSubscriptions / getCategories / saveCategories / getExchangeRateCache / saveExchangeRateCache / getLastNotifyDate / saveLastNotifyDate
- DEFAULT_CATEGORIES: エンタメ / 音楽 / ソフトウェア / クラウド / ニュース / その他

### 5. 為替レート（src/lib/exchange.ts + src/app/api/rate/route.ts）

**当初の問題:** クライアントから直接 frankfurter.app を叩くと、Next.js の fetch キャッシュや CORS でレート取得が失敗。

**解決策:** サーバーサイドプロキシパターンを採用。

```
クライアント → /api/rate（Next.js API Route）
  ├─ Primary:  https://api.frankfurter.app/latest?from=USD&to=JPY
  └─ Fallback: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
```

- 各リクエストに 5秒 AbortController タイムアウト
- クライアント側: 24h localStorage キャッシュ
- `toJpy(amount, currency, rate)`: USD → `Math.floor(amount × rate)`、JPY → amount そのまま
- `formatCachedAt()`: "たった今 / N分前 / N時間前 / N日前" 表示

### 6. 通知（src/lib/notifications.ts）

- アプリ起動時に `checkAndNotify()` を呼び出し（1日1回）
- `lastNotifyDate`（localStorage）で日次重複を防止
- 次の請求日までの日数を計算（月末超えはその月の末日に丸め）
- `daysUntilBilling === sub.notifyDaysBefore` のとき発火
- Notification tag: `subsc-{id}-{todayStr}`（ブラウザ側重複防止）
- 権限未許可時: `Notification.requestPermission()` → 拒否ならページ上部バナー表示

### 7. コンポーネント実装

| ファイル | 役割 |
|---|---|
| SubscriptionApp.tsx | Root: 全状態管理・フィルタロジック |
| Dashboard.tsx | 月間合計・USD/JPYレート・更新ボタン |
| FilterBar.tsx | ステータス/カテゴリフィルタ |
| SubscriptionList.tsx | カード一覧（フィルタ適用後） |
| SubscriptionCard.tsx | サービスカード（クリックで編集・ホバーで削除表示）|
| SubscriptionModal.tsx | 追加/編集モーダル（バリデーション付き）|
| CategoryModal.tsx | カテゴリ管理（インライン編集・削除・追加）|

### 8. UIの調整（ユーザーフィードバック対応）

| フィードバック | 対応 |
|---|---|
| タイトル「サブスク管理」→ 薄いグレー・英語で | `Subscriptions`（#c0bbb6 / font-light）・先頭Sのみ大きく |
| 「＋ 追加」を小さく | `text-[10px]`・#c0bbb6 |
| 為替レートが取得できない | クライアント直接取得 → `/api/rate` プロキシに変更 |
| フィルタ間の余白を広く | `gap-7` に変更 |
| 解約済みは不要 | status から削除、アクティブ/停止中のみ |
| カテゴリを自分で編集したい | CategoryModal.tsx を実装 |
| 英語 → 日本語統一 | すべての表示を日本語に戻す |
| フィルタの「カテゴリ:」表示が野暮ったい | テキストラベルを削除し select のみに |
| ¥ と数字の間にスペース | `¥ {amount}` 形式に修正 |

### 9. 一時的なミス（ロールバック対応）

**事象:** 「カテゴリって部分を削ぎ落として」という指示を、カテゴリ機能ごと削除と誤解。types / storage / 全コンポーネントからカテゴリ関連コードを削除してしまった。

**ユーザーの意図:** フィルタバーの「カテゴリ:」というテキスト表示だけを消したかった。

**対応:** 全ファイルをロールバック後、以下2点のみ変更:
- FilterBar: `<option value="all">すべて</option>`（「カテゴリ:」プレフィックスなし）
- SubscriptionModal: category フィールドのラベルを「カテゴリ」→「分類」に変更

### 10. GitHub公開

```bash
gh repo create subscription-manager --private --source=. --remote=origin --push
```

リポジトリ: https://github.com/kairazukafamily-del/subscription-manager

### 11. ドキュメント整備（引き継ぎ対応）

- `docs/Spec_subscription-manager.md` 更新（全仕様を最新化）
- `docs/Context.md` 更新（Decision Log 追記・全タスク完了マーク）
- `CLAUDE.md` 更新（ディレクトリ構成・起動方法・GitHub URL・カラーパレット全件）
- `docs/WorkHistory.md` 作成（本ファイル）

---

## 最終的なファイル構成

```
subscription-manager/
├── CLAUDE.md
├── docs/
│   ├── Spec_subscription-manager.md
│   ├── Context.md
│   └── WorkHistory.md（本ファイル）
├── src/
│   ├── app/
│   │   ├── api/rate/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── CategoryModal.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── SubscriptionApp.tsx
│   │   ├── SubscriptionCard.tsx
│   │   ├── SubscriptionList.tsx
│   │   └── SubscriptionModal.tsx
│   ├── lib/
│   │   ├── exchange.ts
│   │   ├── notifications.ts
│   │   └── storage.ts
│   └── types/
│       └── index.ts
└── package.json
```

---

## 学んだこと・注意点

1. **Next.js の fetch はサーバーサイドで実行すること** — クライアントコンポーネントから外部APIを直接叩くと、キャッシュやCORSの問題が発生しやすい。API Routeをプロキシとして挟むのが安全。

2. **ユーザーの言葉を正確に解釈すること** — 「カテゴリって部分」= 「カテゴリという文字列」であり、機能全体ではない。文脈を読む。

3. **デザインは静かであること** — 色・サイズ・余白のすべてで「引き算」を意識。my-hp の判断基準（余白が増えるか / 情報が減るか / 静かに見えるか）が有効。
