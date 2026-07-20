# KILA Portfolio

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000. Проект не публикуется автоматически и работает только локально.

## Создание с нуля

```bash
npx create-next-app@latest my-portfolio --typescript --tailwind --eslint --app
cd my-portfolio
npx shadcn@latest init
npx shadcn@latest add button card separator
npm install framer-motion next-themes lucide-react
npm run dev
```

Все тексты меняются в `lib/data.js`.

Все компоненты с хуками или анимацией делай клиентскими (`use client`), остальные можно серверными.
