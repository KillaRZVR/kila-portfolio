import asyncio
import json
import logging
import os
import tempfile
from pathlib import Path

import requests
from dotenv import load_dotenv
from faster_whisper import WhisperModel
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "").strip()
GITHUB_REPOSITORY = os.getenv("GITHUB_REPOSITORY", "KillaRZVR/kila-portfolio").strip()
GITHUB_API_BASE = "https:" + "//api.github.com"
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small").strip()
SETUP_CODE = os.getenv("SETUP_CODE", "").strip()
OWNER_FILE = BASE_DIR / "owner.json"

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("kila-telegram-bot")
_whisper_model = None


def get_owner_id():
    if not OWNER_FILE.exists():
        return None
    try:
        return int(json.loads(OWNER_FILE.read_text(encoding="utf-8"))["user_id"])
    except (ValueError, KeyError, json.JSONDecodeError):
        return None


def set_owner_id(user_id: int):
    OWNER_FILE.write_text(json.dumps({"user_id": user_id}, ensure_ascii=False), encoding="utf-8")


def is_owner(user_id: int):
    owner_id = get_owner_id()
    return owner_id is not None and owner_id == user_id


def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        logger.info("Загружаю модель Whisper: %s", WHISPER_MODEL)
        _whisper_model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
    return _whisper_model


def transcribe_audio(file_path: str):
    model = get_whisper_model()
    segments, _ = model.transcribe(file_path, vad_filter=True, beam_size=5)
    return " ".join(segment.text.strip() for segment in segments).strip()


def create_github_issue(instruction: str, source: str):
    short_title = " ".join(instruction.split())[:72]
    title = f"[VOICE TASK] {short_title}"
    body = (
        "## Задача для KILA\n\n"
        f"{instruction.strip()}\n\n"
        "## Источник\n\n"
        f"Telegram ({source}). Создано владельцем локального бота.\n"
    )
    response = requests.post(
        f"{GITHUB_API_BASE}/repos/{GITHUB_REPOSITORY}/issues",
        headers={
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        json={"title": title, "body": body},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["html_url"]


async def require_owner(update: Update):
    user = update.effective_user
    if user and is_owner(user.id):
        return True
    if update.effective_message:
        await update.effective_message.reply_text("Доступ запрещён.")
    return False


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    message = update.effective_message
    if not user or not message:
        return

    owner_id = get_owner_id()
    if owner_id is None:
        provided_code = context.args[0] if context.args else ""
        if not SETUP_CODE or provided_code != SETUP_CODE:
            await message.reply_text("Для привязки владельца отправь /start и код из окна установки.")
            return
        set_owner_id(user.id)
        await message.reply_text("Готово. Этот Telegram-аккаунт назначен владельцем KILA Bot.")
        return

    if owner_id != user.id:
        await message.reply_text("Доступ запрещён.")
        return

    await message.reply_text("KILA Bot готов. Пришли голосовое сообщение или текст с задачей по проекту.")


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if await require_owner(update):
        await update.effective_message.reply_text(
            f"Бот работает. Репозиторий: {GITHUB_REPOSITORY}. Модель: Whisper {WHISPER_MODEL}."
        )


async def handle_voice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not await require_owner(update):
        return

    message = update.effective_message
    media = message.voice or message.audio
    status = await message.reply_text("Получил голосовое. Распознаю текст…")

    try:
        telegram_file = await context.bot.get_file(media.file_id)
        suffix = ".ogg" if message.voice else Path(media.file_name or "audio.mp3").suffix
        with tempfile.TemporaryDirectory(prefix="kila-voice-") as temp_dir:
            audio_path = Path(temp_dir) / f"voice{suffix}"
            await telegram_file.download_to_drive(custom_path=str(audio_path))
            transcript = await asyncio.to_thread(transcribe_audio, str(audio_path))

        if not transcript:
            await status.edit_text("Не удалось распознать речь. Попробуй записать голосовое ещё раз.")
            return

        issue_url = await asyncio.to_thread(create_github_issue, transcript, "голосовое сообщение")
        await status.edit_text(f"Текст:\n\n{transcript}\n\nЗадача создана: {issue_url}")
    except Exception as error:
        logger.exception("Ошибка обработки голосового")
        await status.edit_text(f"Ошибка: {error}")


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not await require_owner(update):
        return

    instruction = (update.effective_message.text or "").strip()
    if not instruction:
        return

    status = await update.effective_message.reply_text("Создаю задачу в GitHub…")
    try:
        issue_url = await asyncio.to_thread(create_github_issue, instruction, "текстовое сообщение")
        await status.edit_text(f"Задача создана: {issue_url}")
    except Exception as error:
        logger.exception("Ошибка создания задачи")
        await status.edit_text(f"Ошибка: {error}")


def main():
    if not TELEGRAM_BOT_TOKEN or not GITHUB_TOKEN:
        raise RuntimeError("Запусти setup-telegram-bot.bat и укажи токены.")

    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("status", status_command))
    application.add_handler(MessageHandler(filters.VOICE | filters.AUDIO, handle_voice))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    logger.info("KILA Telegram Bot запущен")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
