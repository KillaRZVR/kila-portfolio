@echo off
setlocal EnableExtensions
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
  %PYTHON_CMD% -m venv .venv
  if errorlevel 1 (
    echo Не удалось создать окружение Python.
    pause
    exit /b 1
  )
)

echo Устанавливаю и проверяю зависимости...
call .venv\Scripts\python.exe -m pip install --upgrade pip
call .venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 (
  echo Не удалось установить зависимости.
  pause
  exit /b 1
)

call .venv\Scripts\python.exe configure.py
if errorlevel 1 (
  echo.
  echo Настройка не завершена. Исправь указанную ошибку и запусти файл снова.
  pause
  exit /b 1
)

call start-telegram-bot.bat
