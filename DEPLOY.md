# Google Photos Viewer — деплой на Cloudflare Pages

## 1. Залить на GitHub
1. Создай новый репозиторий на github.com (любое имя, например `photos-viewer`)
2. Загрузи туда все файлы из этой папки (`public/`, `functions/`)

## 2. Подключить к Cloudflare Pages
1. Зайди на dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
2. Выбери свой репозиторий
3. Build settings:
   - Build command: оставь пустым
   - Build output directory: `public`
   - Functions: Cloudflare сам подхватит папку `functions/` в корне репозитория
4. Deploy

После деплоя получишь домен вида `photos-viewer.pages.dev`

## 3. Добавить redirect URI в Google Cloud Console
В разделе console.cloud.google.com/auth/clients открой свой OAuth client
и добавь Authorized redirect URI:

```
https://ТВОЙ-ДОМЕН.pages.dev/api/callback
```

## 4. Добавить переменные окружения в Cloudflare
В настройках проекта Pages → Settings → Environment variables, добавь:

- `GOOGLE_CLIENT_ID` = твой Client ID
- `GOOGLE_CLIENT_SECRET` = твой Client Secret

После добавления — Redeploy (Deployments → последний деплой → Retry / Redeploy)

## 5. Вписать CLIENT_ID в код
Открой `public/index.html` и `public/album.html`, найди строку:

```js
const CLIENT_ID = "ВСТАВЬ_СВОЙ_CLIENT_ID";
```

(она есть только в index.html, album.html токен не запрашивает)
Замени на свой реальный Client ID (тот же, что в Cloudflare env), закоммить и запушь.

## 6. Готово
Открываешь `https://ТВОЙ-ДОМЕН.pages.dev`, жмёшь "Войти через Google",
выбираешь аккаунт, разрешаешь доступ — попадаешь в список альбомов.
Друг делает то же самое (нужно, чтобы его email был добавлен
в Test users в OAuth consent screen / Audience).

## Важно
- `access_token` живёт ~1 час. После истечения понадобится повторный логин
  (refresh_token логика пока не реализована — для 2 человек проще
  просто перелогиниваться раз в час по необходимости).
- Все токены хранятся в localStorage браузера — никуда не отправляются
  кроме самих API-запросов к Google.
