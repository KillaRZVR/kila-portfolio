@echo off
chcp 65001 >nul
cd /d "%~dp0"
title KILA — локальный запуск

where npm >nul 2>&1
if errorlevel 1 (
  echo Node.js и npm не найдены.
  echo Установите Node.js LTS: https://nodejs.org/
  start "" "https://nodejs.org/"
  pause
  exit /b 1
)

if not exist node_modules (
  echo Устанавливаю зависимости проекта...
  call npm install
  if errorlevel 1 (
    echo Ошибка установки зависимостей.
    pause
    exit /b 1
  )
)

echo Запускаю локальный сервер...
start "KILA Local Server" cmd /k "npm run dev"

echo Жду готовности http://localhost:3000 ...
for /l %%i in (1,1,60) do (
  curl.exe -s -o nul http://localhost:3000 >nul 2>&1 && goto ready
  timeout /t 1 /nobreak >nul
)

echo Сервер не ответил за 60 секунд. Проверьте окно KILA Local Server.
pause
exit /b 1

:ready
echo Готово. Открываю сайт.
start "" "http://localhost:3000"
exit /b 0
