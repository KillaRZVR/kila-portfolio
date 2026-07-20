export const runtime = "nodejs";
export const maxDuration = 60;

const TELEGRAM_API = "https:" + "//api.telegram.org";
const TELEGRAM_FILE_API = "https:" + "//api.telegram.org/file";
const GROQ_API = "https:" + "//api.groq.com/openai/v1";
const GITHUB_API = "https:" + "//api.github.com";
const ALLOWED_AUDIO_EXTENSIONS = new Set([
  ".flac", ".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".ogg", ".opus", ".wav", ".webm",
]);

function env(name, required = true) {
  const value = process.env[name]?.trim();
  if (required && !value) throw new Error(`Missing environment variable: ${name}`);
  return value || "";
}

function normalizeAudioFilename(filePath = "", preferredName = "") {
  const sourceName = preferredName || filePath.split("/").pop() || "voice.ogg";
  const dotIndex = sourceName.lastIndexOf(".");
  let extension = dotIndex >= 0 ? sourceName.slice(dotIndex).toLowerCase() : ".ogg";
  if (extension === ".oga") extension = ".ogg";
  if (!ALLOWED_AUDIO_EXTENSIONS.has(extension)) extension = ".ogg";
  return `telegram-audio${extension}`;
}

async function telegramApi(method, payload) {
  const token = env("TELEGRAM_BOT_TOKEN");
  const response = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(`Telegram ${method}: ${data.description || response.status}`);
  return data.result;
}

async function sendMessage(chatId, text) {
  const safeText = text.length > 4000 ? `${text.slice(0, 3990)}…` : text;
  return telegramApi("sendMessage", { chat_id: chatId, text: safeText, disable_web_page_preview: true });
}

async function transcribeTelegramFile(fileId, preferredName = "") {
  const token = env("TELEGRAM_BOT_TOKEN");
  const groqKey = env("GROQ_API_KEY");
  const file = await telegramApi("getFile", { file_id: fileId });
  const download = await fetch(`${TELEGRAM_FILE_API}/bot${token}/${file.file_path}`);
  if (!download.ok) throw new Error(`Не удалось скачать голосовое: ${download.status}`);

  const audio = await download.blob();
  const filename = normalizeAudioFilename(file.file_path, preferredName);
  const form = new FormData();
  form.append("file", audio, filename);
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "json");
  form.append("language", "ru");

  const response = await fetch(`${GROQ_API}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${groqKey}` },
    body: form,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Groq Whisper: ${data.error?.message || response.status}`);
  return String(data.text || "").trim();
}

async function createGitHubIssue(instruction, source) {
  const repository = env("GITHUB_REPOSITORY", false) || "KillaRZVR/kila-portfolio";
  const githubToken = env("GITHUB_TOKEN");
  const compact = instruction.replace(/\s+/g, " ").trim();
  const title = `[VOICE TASK] ${compact.slice(0, 72)}`;
  const body = [
    "## Задача для KILA",
    "",
    instruction.trim(),
    "",
    "## Источник",
    "",
    `Telegram (${source}). Создано облачным ботом владельца.`,
  ].join("\n");

  const response = await fetch(`${GITHUB_API}/repos/${repository}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`GitHub: ${data.message || response.status}`);
  return data.html_url;
}

function getMessage(update) {
  return update.message || update.edited_message || update.channel_post || null;
}

export async function GET() {
  return Response.json({
    ok: true,
    service: "KILA Telegram Cloud Bot",
    configured: {
      telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      groq: Boolean(process.env.GROQ_API_KEY),
      github: Boolean(process.env.GITHUB_TOKEN),
      owner: Boolean(process.env.TELEGRAM_ALLOWED_USER_ID),
    },
  });
}

export async function POST(request) {
  const expectedSecret = env("TELEGRAM_WEBHOOK_SECRET", false);
  if (expectedSecret) {
    const actualSecret = request.headers.get("x-telegram-bot-api-secret-token") || "";
    if (actualSecret !== expectedSecret) return Response.json({ ok: false }, { status: 401 });
  }

  let chatId = null;
  try {
    const update = await request.json();
    const message = getMessage(update);
    if (!message?.from?.id || !message?.chat?.id) return Response.json({ ok: true });

    chatId = message.chat.id;
    const userId = String(message.from.id);
    const allowedUserId = env("TELEGRAM_ALLOWED_USER_ID", false);
    const text = String(message.text || message.caption || "").trim();

    if (!allowedUserId) {
      await sendMessage(chatId, `Твой Telegram ID: ${userId}\nДобавь его в Vercel как TELEGRAM_ALLOWED_USER_ID и выполни Redeploy.`);
      return Response.json({ ok: true });
    }

    if (userId !== allowedUserId) return Response.json({ ok: true });

    if (text === "/start" || text === "/status") {
      await sendMessage(chatId, "KILA Cloud Bot работает. Пришли голосовое сообщение или текст с задачей по проекту.");
      return Response.json({ ok: true });
    }

    let instruction = text;
    let source = "текстовое сообщение";

    if (message.voice?.file_id || message.audio?.file_id) {
      await sendMessage(chatId, "Получил голосовое. Распознаю через Groq Whisper…");
      const fileId = message.voice?.file_id || message.audio.file_id;
      const preferredName = message.voice ? "voice.ogg" : (message.audio?.file_name || "audio.mp3");
      instruction = await transcribeTelegramFile(fileId, preferredName);
      source = "голосовое сообщение";
      if (!instruction) throw new Error("Не удалось распознать речь");
    }

    if (!instruction) {
      await sendMessage(chatId, "Пришли голосовое сообщение или обычный текст.");
      return Response.json({ ok: true });
    }

    const issueUrl = await createGitHubIssue(instruction, source);
    await sendMessage(chatId, `Задача принята:\n\n${instruction}\n\nGitHub: ${issueUrl}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("KILA Telegram webhook error", error);
    if (chatId) {
      try {
        await sendMessage(chatId, `Ошибка: ${error instanceof Error ? error.message : "неизвестная ошибка"}`);
      } catch (_) {}
    }
    return Response.json({ ok: true });
  }
}
