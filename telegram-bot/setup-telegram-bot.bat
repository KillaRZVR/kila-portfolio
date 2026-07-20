@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title KILA Telegram Bot — установка

set "PYTHON_CMD="
py -3.12 --version >nul 2>&1 && set "PYTHON_CMD=py -3.12"
if not defined PYTHON_CMD py -3.11 --version >nul 2>&1 && set "PYTHON_CMD=py -3.11"
if not defined PYTHON_CMD python --version >nul 2>&1 && set "PYTHON_CMD=python"

if not defined PYTHON_CMD (
  echo Python не найден. Устанавливаю Python 3.12...
  winget install --id Python.Python.3.12 -e --source winget
  echo.
  echo После установки закрой это окно и снова запусти setup-telegram-bot.bat.
  pause
  exit /b 0
)

if not exist ".venv\Scripts\python.exe" (
  echo Создаю окружение Python...
  !PYTHON_CMD! -m venv .venv
)

echo Устанавливаю Whisper и Telegram Bot...
call .venv\Scripts\python.exe -m pip install --upgrade pip
call .venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 (
  echo Не удалось установить зависимости.
  pause
  exit /b 1
)

set "NEED_CONFIG=0"
if not exist .env set "NEED_CONFIG=1"
if exist .env (
  findstr /R /C:"^TELEGRAM_BOT_TOKEN=." .env >nul || set "NEED_CONFIG=1"
  findstr /R /C:"^GITHUB_TOKEN=." .env >nul || set "NEED_CONFIG=1"
)

if "!NEED_CONFIG!"=="1" (
  echo.
  echo Токены сохраняются только на этом компьютере и не попадут в GitHub.
  set /p "TELEGRAM_TOKEN=Вставь токен от BotFather: "
  set /p "GH_TOKEN=Вставь GitHub token: "

  if not defined TELEGRAM_TOKEN (
    echo Токен Telegram не введён.
    pause
    exit /b 1
  )
  if not defined GH_TOKEN (
    echo GitHub token не введён.
    pause
    exit /b 1
  )

  set "CODE=!RANDOM!!RANDOM!"
  > .env echo TELEGRAM_BOT_TOKEN=!TELEGRAM_TOKEN!
  >> .env echo GITHUB_TOKEN=!GH_TOKEN!
  >> .env echo GITHUB_REPOSITORY=KillaRZVR/kila-portfolio
  >> .env echo WHISPER_MODEL=small
  >> .env echo SETUP_CODE=!CODE!

  echo.
  echo Код привязки: !CODE!
  echo После запуска отправь боту: /start !CODE!
  echo.
)

call start-telegram-bot.bat
