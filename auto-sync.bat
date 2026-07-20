@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title KILA — автоматическая синхронизация

where git >nul 2>&1
if errorlevel 1 (
  echo Git не найден. Установите Git и перезапустите файл.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo Node.js и npm не найдены. Установите Node.js LTS.
  pause
  exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo Эта папка не является Git-репозиторием.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Устанавливаю зависимости...
  call npm install
  if errorlevel 1 (
    echo Не удалось установить зависимости.
    pause
    exit /b 1
  )
)

echo Запускаю локальный сайт...
start "KILA Dev Server" cmd /k "cd /d ""%~dp0"" && npm run dev"
timeout /t 6 /nobreak >nul
start "" "http://localhost:3000"

echo.
echo Автосинхронизация включена.
echo Проверка GitHub выполняется каждые 10 секунд.
echo Не закрывайте это окно во время работы.
echo.

:sync
set "BEHIND=0"
set "DIRTY="

git fetch origin main >nul 2>&1
if errorlevel 1 (
  echo [%time%] Нет соединения с GitHub. Повторю позже.
  goto wait
)

for /f %%A in ('git rev-list --count HEAD..origin/main') do set "BEHIND=%%A"
if "%BEHIND%"=="0" goto wait

for /f %%A in ('git status --porcelain') do set "DIRTY=1"
if defined DIRTY (
  echo [%time%] Есть локальные изменения — автоматическое обновление приостановлено.
  goto wait
)

echo [%time%] Найдено обновление. Загружаю...
git pull --ff-only origin main
if errorlevel 1 (
  echo [%time%] Не удалось применить обновление.
  goto wait
)

call npm install --silent >nul 2>&1
echo [%time%] Проект обновлён. Сайт перезагрузится автоматически.

:wait
timeout /t 10 /nobreak >nul
goto sync
