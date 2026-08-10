# 動画同時投稿ツール v1.2.1

YouTube Data APIとTikTok Content Posting APIを使う個人用Webツールです。

1. `.env.example`を`.env`へ複製し、両サービスのOAuth認証情報を入力します。
2. `npm start`を実行し、`http://localhost:3000`を開きます。
3. 両アカウントを接続し、MP4・タイトル・説明文・公開範囲を選んで投稿します。

リダイレクトURLは `http://localhost:3000/auth/youtube/callback` と `http://localhost:3000/auth/tiktok/callback` です。本番では`APP_URL`をHTTPSの公開URLへ変更します。
