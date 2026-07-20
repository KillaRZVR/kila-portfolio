# Полностью облачный KILA

## Что получится

- сайт доступен по Vercel URL с любого устройства;
- Telegram принимает текст и голос круглосуточно;
- Groq Whisper транскрибирует аудио;
- GitHub Issue с префиксом `[VOICE TASK]` попадает агенту;
- после коммита Vercel автоматически обновляет сайт.

## 1. Vercel

1. Создай аккаунт на vercel.com через GitHub.
2. Нажми Add New → Project.
3. Импортируй `KillaRZVR/kila-portfolio`.
4. Framework Preset: Next.js. Остальные настройки оставь стандартными.

## 2. Groq

1. Создай аккаунт на console.groq.com.
2. Открой API Keys и создай ключ.
3. Не отправляй ключ в чат.

## 3. Environment Variables в Vercel

Добавь в Project → Settings → Environment Variables:

- `TELEGRAM_BOT_TOKEN` — токен BotFather;
- `TELEGRAM_WEBHOOK_SECRET` — любая длинная случайная строка без пробелов;
- `GROQ_API_KEY` — ключ Groq;
- `GITHUB_TOKEN` — fine-grained token с Issues: Read and write и Contents: Read and write;
- `GITHUB_REPOSITORY` — `KillaRZVR/kila-portfolio`.

Пока не добавляй `TELEGRAM_ALLOWED_USER_ID`.

## 4. Установить webhook

После первого Deploy скопируй адрес проекта, например `https://kila-portfolio.vercel.app`.

В CMD выполни одной строкой, подставив значения:

```cmd
curl -X POST "https://api.telegram.org/botТВОЙ_TELEGRAM_TOKEN/setWebhook" -d "url=https://АДРЕС_ПРОЕКТА/api/telegram" -d "secret_token=ТВОЙ_WEBHOOK_SECRET"
```

Не показывай эту команду и скриншот с токеном другим людям.

## 5. Разрешить свой Telegram

1. Отправь боту `/start`.
2. Бот ответит твоим числовым Telegram ID.
3. Добавь в Vercel переменную `TELEGRAM_ALLOWED_USER_ID` с этим числом.
4. Открой Deployments → последний deployment → Redeploy.
5. Снова отправь `/start` — бот подтвердит готовность.

## Проверка

- открой `https://АДРЕС_ПРОЕКТА/api/telegram` — все пункты configured должны стать `true`;
- отправь боту текстовую задачу;
- проверь появление GitHub Issue с заголовком `[VOICE TASK]`;
- отправь короткое голосовое и дождись транскрипции.
