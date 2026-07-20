import getpass
import secrets
import sys
import tempfile
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
REPOSITORY = "KillaRZVR/kila-portfolio"
TELEGRAM_API = "https:" + "//api.telegram.org"
GITHUB_API = "https:" + "//api.github.com"


def write_env(path: Path, telegram_token: str, github_token: str, setup_code: str):
    content = (
        f"TELEGRAM_BOT_TOKEN={telegram_token}\n"
        f"GITHUB_TOKEN={github_token}\n"
        f"GITHUB_REPOSITORY={REPOSITORY}\n"
        "WHISPER_MODEL=small\n"
        f"SETUP_CODE={setup_code}\n"
    )
    path.write_text(content, encoding="utf-8")


def validate_telegram_token(token: str):
    response = requests.get(f"{TELEGRAM_API}/bot{token}/getMe", timeout=20)
    if response.status_code != 200 or not response.json().get("ok"):
        raise ValueError("Telegram token неверный или недоступен")
    return response.json()["result"].get("username", "unknown_bot")


def validate_github_token(token: str):
    response = requests.get(
        f"{GITHUB_API}/repos/{REPOSITORY}",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        timeout=20,
    )
    if response.status_code != 200:
        raise ValueError("GitHub token не видит репозиторий kila-portfolio")
    permissions = response.json().get("permissions", {})
    if permissions and not permissions.get("push", False):
        raise ValueError("GitHub token не имеет права записи в репозиторий")


def self_test():
    with tempfile.TemporaryDirectory(prefix="kila-config-test-") as directory:
        test_path = Path(directory) / ".env"
        write_env(test_path, "telegram:test", "github_pat_test", "123456")
        actual = test_path.read_text(encoding="utf-8")
        expected_lines = {
            "TELEGRAM_BOT_TOKEN=telegram:test",
            "GITHUB_TOKEN=github_pat_test",
            "GITHUB_REPOSITORY=KillaRZVR/kila-portfolio",
            "WHISPER_MODEL=small",
            "SETUP_CODE=123456",
        }
        assert expected_lines.issubset(set(actual.splitlines()))
    print("SELF_TEST_OK")


def main():
    if "--self-test" in sys.argv:
        self_test()
        return

    print("\nТокены вводятся скрыто и сохраняются только в telegram-bot/.env.")
    telegram_token = getpass.getpass("Вставь токен от BotFather: ").strip()
    github_token = getpass.getpass("Вставь GitHub token: ").strip()

    if not telegram_token:
        raise ValueError("Токен Telegram не введён")
    if not github_token:
        raise ValueError("GitHub token не введён")

    print("Проверяю Telegram token...")
    bot_username = validate_telegram_token(telegram_token)
    print("Проверяю GitHub token...")
    validate_github_token(github_token)

    setup_code = str(secrets.randbelow(900000) + 100000)
    write_env(ENV_PATH, telegram_token, github_token, setup_code)

    print("\nНастройка сохранена.")
    print(f"Telegram bot: @{bot_username}")
    print(f"Код привязки: {setup_code}")
    print(f"Отправь боту команду: /start {setup_code}\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"\nОШИБКА: {error}")
        sys.exit(1)
