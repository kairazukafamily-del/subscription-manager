# Spec_subscription-manager.md

## 目的

個人用サブスクリプション管理ローカルWebアプリ。
月額サービスの把握・USD/JPY自動換算・請求日のブラウザ通知。

---

## データ構造

### Subscription（`src/types/index.ts`）

| フィールド | 型 | 説明 |
|---|---|---|
| id | string | crypto.randomUUID() |
| name | string | サービス名 |
| amount | number | 金額（通貨単位） |
| currency | `'JPY' \| 'USD'` | 通貨 |
| billingDay | number (1–31) | 毎月の請求日 |
| category | string | CategoryのID |
| status | `'active' \| 'paused'` | アクティブ / 停止中 |
| notifyDaysBefore | number | 何日前に通知（0=通知なし）|
| createdAt | string (ISO 8601) | 作成日時 |

### Category（`src/types/index.ts`）

| フィールド | 型 |
|---|---|
| id | string |
| name | string |

### ExchangeRateCache（`src/types/index.ts`）

| フィールド | 型 |
|---|---|
| rate | number（USD→JPY レート） |
| cachedAt | string（ISO 8601） |

### localStorageキー一覧（`src/lib/storage.ts`）

| キー | 内容 |
|---|---|
| `subsc_v1_subscriptions` | Subscription[] |
| `subsc_v1_categories` | Category[] |
| `subsc_v1_exchange_rate` | ExchangeRateCache |
| `subsc_v1_notify_checked` | 最終通知チェック日（YYYY-MM-DD） |

---

## 画面構成

### トップページ（1ページ完結）

```
ヘッダー: "サブスク管理"                    ＋ 追加
────────────────────────────────────────
月間合計（アクティブのみ・JPY換算済み）
アクティブ件数  /  USD/JPY レート + 更新時刻 [↻]
────────────────────────────────────────
ステータスフィルタ: すべて / アクティブ / 停止中
分類フィルタ: すべて / [カテゴリ名] ...  [編集]
────────────────────────────────────────
サービス一覧（カード）
  サービス名                           ¥ 金額
  カテゴリ名  ·  毎月N日  ·  $N × ¥N   ステータス
                                        [削除 ホバー表示]
```

### モーダル（追加/編集）

| フィールド | 内容 |
|---|---|
| サービス名 | テキスト入力（必須） |
| 金額 | 数値入力（必須・0より大きい） |
| 通貨 | JPY / USD 切り替え |
| 請求日 | 1–31 の整数（必須） |
| 分類 | 既存カテゴリ選択 or「＋ 新しく追加」でインライン追加 |
| 状態 | アクティブ / 停止中 |
| 通知 | 通知なし / 1 / 3 / 5 / 7 / 14 / 30 日前 |

### カテゴリ管理モーダル（フィルタ行の「編集」から起動）

- カテゴリ名をクリックしてインライン編集（Enter確定 / Escape取消）
- 使用中でなければ × で削除（使用件数を表示）
- 下部入力欄で新規追加（Enter または「追加」ボタン）

---

## 合計ロジック

- `status === 'active'` のサービスのみ合計対象
- USD: `Math.floor(amount × rate)` でJPY換算
- 月間合計 = 換算済みJPY合計

---

## 為替レート（`src/lib/exchange.ts` + `src/app/api/rate/route.ts`）

クライアントは `/api/rate` を叩く（直接外部APIを呼ばない）。

```
クライアント → /api/rate（Next.js API Route）
  ├─ Primary:  https://api.frankfurter.app/latest?from=USD&to=JPY
  └─ Fallback: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
```

| 項目 | 仕様 |
|---|---|
| Timeout（各リクエスト） | 5秒 |
| クライアントキャッシュ | 24時間（localStorage） |
| キャッシュ有効時 | APIを叩かずキャッシュ値を返す |
| エラー時 | キャッシュ値を使用。なければ「取得できません」+「再試行」ボタン表示 |
| 手動更新 | ダッシュボードの「↻」ボタンで強制再取得（`forceRefresh=true` でキャッシュをスキップ）|

---

## 通知（`src/lib/notifications.ts`）

| 項目 | 仕様 |
|---|---|
| タイミング | アプリ起動時に1日1回チェック（lastNotifyDateで管理） |
| 対象 | `status === 'active'` かつ `notifyDaysBefore > 0` |
| 発火条件 | 本日から次の請求日まで `notifyDaysBefore` 日ちょうど |
| 月末超え | 存在しない日付はその月の末日に丸める |
| 未許可時 | `Notification.requestPermission()` を実行 → 拒否ならページ上部バナー表示 |
| 重複防止 | Notification の `tag` に `subsc-{id}-{date}` を指定 |

---

## デフォルトカテゴリ

`src/lib/storage.ts` の `DEFAULT_CATEGORIES` で定義。localStorageに未保存の場合に使用。

| ID | 名前 |
|---|---|
| entertainment | エンタメ |
| music | 音楽 |
| software | ソフトウェア |
| cloud | クラウド |
| news | ニュース |
| other | その他 |

---

## 実装済み完了条件

- [x] サービスCRUD（追加・編集・削除）が動作する
- [x] localStorageで永続化される
- [x] USD→JPY換算が正確（`Math.floor`）
- [x] 月間合計がアクティブのみ集計
- [x] カテゴリのカスタム追加・編集・削除が動作
- [x] ブラウザ通知が指定日数前に発火（1日1回チェック）
- [x] ステータス・分類フィルタが動作
- [x] 為替レートのサーバーサイドプロキシ（CDNフォールバック付き）
- [x] GitHubパブリックリポジトリに公開済み
