@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title KILA Telegram Bot

if not exist ".venv\Scripts\python.exe" (
  echo Сначала запусти setup-telegram-bot.bat.
  pause
  exit /b 1
)

if not exist ".env" (
  echo Файл .env не найден. Запусти setup-telegram-bot.bat.
  pause
  exit /b 1
)

call .venv\Scripts\python.exe bot.py
if errorlevel 1 (
  echo.
  echo Бот остановлен из-за ошибки.
  pause
)
