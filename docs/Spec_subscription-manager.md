# Spec_subscription-manager.md

## 目的

個人用サブスクリプション管理ローカルWebアプリ。月額サービスの把握と請求通知。

---

## データ構造

### Subscription

| フィールド | 型 | 説明 |
|---|---|---|
| id | string | UUID |
| name | string | サービス名 |
| amount | number | 金額 |
| currency | 'JPY' \| 'USD' | 通貨 |
| billingDay | number (1–31) | 毎月の請求日 |
| category | string | カテゴリID |
| status | 'active' \| 'paused' \| 'cancelled' | 状態 |
| notifyDaysBefore | number | 何日前に通知（0=通知なし）|
| createdAt | string (ISO) | 作成日時 |

### Category

| フィールド | 型 |
|---|---|
| id | string |
| name | string |

### ExchangeRateCache

| フィールド | 型 |
|---|---|
| rate | number (USD→JPY) |
| cachedAt | string (ISO) |

---

## 画面構成

### トップページ（1ページ完結）

```
ヘッダー: "サブスク管理"  ＋追加
────────────────────────
月間合計（アクティブのみ）
アクティブ件数 / USD/JPYレート
────────────────────────
フィルタ: ステータス / カテゴリ
────────────────────────
サービス一覧（カード）
```

### モーダル（追加/編集）

- サービス名
- 金額 + 通貨（JPY/USD）
- 請求日（1–31日）
- カテゴリ（既存選択 or 新規追加）
- 状態（アクティブ/停止中/解約済み）
- 通知（通知なし/1/3/5/7/14/30日前）

---

## 合計ロジック

- アクティブ（status === 'active'）のみ合計対象
- USD: `Math.floor(amount × rate)` でJPY換算
- 月間合計 = 換算済みJPYの合計

---

## 為替レート

- API: `https://api.frankfurter.app/latest?from=USD&to=JPY`
- Timeout: 5秒
- キャッシュ: 24時間（localStorage）
- エラー時: キャッシュ値を使用。なければ error 表示

---

## 通知

- 起動時に1日1回チェック（lastNotifyDate で管理）
- アクティブサービスで `notifyDaysBefore > 0` のみ対象
- 次の請求日まで `notifyDaysBefore` 日ちょうどになったら通知
- Notification API 未許可: 許可リクエスト → 拒否ならページ上部バナー表示

---

## 完了条件

- [ ] サービスCRUD（追加・編集・削除）が動作する
- [ ] localStorageで永続化される
- [ ] USD→JPY換算が正確（Math.floor）
- [ ] 月間合計がアクティブのみ集計
- [ ] カテゴリのカスタム追加が動作
- [ ] ブラウザ通知が指定日数前に発火
- [ ] ステータス・カテゴリフィルタが動作
