# Video Crossposter v1.2.10

YouTube Data APIとTikTok Content Posting APIを使う個人用Webツールです。

1. `.env.example`を`.env`へ複製し、両サービスのOAuth認証情報を入力します。
2. `npm start`を実行し、公式サイト `http://localhost:3000` を開きます。
3. `http://localhost:3000/app` から投稿ツールを開きます。
4. 両アカウントを接続し、MP4・タイトル・説明文・公開範囲を選んで投稿します。

YouTube投稿時は任意のJPG・PNG画像（2MB以下）をカスタムサムネイルとして設定できます。

YouTube投稿完了後は、動画URLとコピーボタンが投稿画面に表示されます。タイトル・URL・投稿日時は同じブラウザに30日間保存され、履歴から再コピーできます。

リダイレクトURLは `http://localhost:3000/auth/youtube/callback` と `http://localhost:3000/auth/tiktok/callback` です。本番では`APP_URL`をHTTPSの公開URLへ変更します。
