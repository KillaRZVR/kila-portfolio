export const runtime = "nodejs";
export const maxDuration = 60;

const TELEGRAM_API = "https:" + "//api.telegram.org";
const TELEGRAM_FILE_API = "https:" + "//api.telegram.org/file";
const GROQ_API = "https:" + "//api.groq.com/openai/v1";
const GITHUB_API = "https:" + "//api.github.com";
const ROUTE_CONFIG_TITLE = "[KILA BOT CONFIG] Active Notion agent";
const CURRENT_AGENT_PREFIX = "[VOICE CURRENT]";
const OLD_AGENT_PREFIX = "[VOICE TASK]";
const ALLOWED_AUDIO_EXTENSIONS = new Set([
  ".flac", ".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".ogg", ".opus", ".wav", ".webm",
]);

function env(name, required = true) {
  const value = process.env[name]?.trim();
  if (required && !value) throw new Error(`Missing environment variable: ${name}`);
  return value || "";
}

function repositoryName() {
  return env("GITHUB_REPOSITORY", false) || "KillaRZVR/kila-portfolio";
}

function normalizeAudioFilename(filePath = "", preferredName = "") {
  const sourceName = preferredName || filePath.split("/").pop() || "voice.ogg";
  const dotIndex = sourceName.lastIndexOf(".");
  let extension = dotIndex >= 0 ? sourceName.slice(dotIndex).toLowerCase() : ".ogg";
  if (extension === ".oga") extension = ".ogg";
  if (!ALLOWED_AUDIO_EXTENSIONS.has(extension)) extension = ".ogg";
  return `telegram-audio${extension}`;
}

function formatStatus(description, stage, extra = "") {
  const cleanDescription = String(description || "Новая задача").trim().slice(0, 2800);
  const cleanExtra = String(extra || "").trim();
  const text = `Задача:\n${cleanDescription}\n\nСтадия: ${stage}${cleanExtra ? `\n\n${cleanExtra}` : ""}`;
  return text.length > 4000 ? `${text.slice(0, 3990)}…` : text;
}

async function telegramApi(method, payload) {
  const response = await fetch(`${TELEGRAM_API}/bot${env("TELEGRAM_BOT_TOKEN")}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(`Telegram ${method}: ${data.description || response.status}`);
  return data.result;
}

const sendMessage = (chatId, text) => telegramApi("sendMessage", {
  chat_id: chatId,
  text,
  disable_web_page_preview: true,
});

const editMessage = (chatId, messageId, text) => telegramApi("editMessageText", {
  chat_id: chatId,
  message_id: messageId,
  text,
  disable_web_page_preview: true,
});

async function githubApi(path, { method = "GET", body } = {}) {
  const response = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`GitHub: ${data.message || response.status}`);
  return data;
}

function routeConfigBody(agent) {
  return [
    "Служебная настройка Telegram-бота. Не закрывать.",
    "",
    `ACTIVE_AGENT: ${agent}`,
    "",
    "current — этот Notion-агент; old — агент прошлого аккаунта.",
  ].join("\n");
}

async function findRouteConfigIssue() {
  const issues = await githubApi(`/repos/${repositoryName()}/issues?state=open&per_page=100`);
  return issues.find((issue) => issue.title === ROUTE_CONFIG_TITLE) || null;
}

async function getActiveAgent() {
  const issue = await findRouteConfigIssue();
  if (!issue) return "current";
  const match = String(issue.body || "").match(/ACTIVE_AGENT:\s*(current|old)/i);
  return match ? match[1].toLowerCase() : "current";
}

async function setActiveAgent(agent) {
  const issue = await findRouteConfigIssue();
  if (issue) {
    await githubApi(`/repos/${repositoryName()}/issues/${issue.number}`, {
      method: "PATCH",
      body: { body: routeConfigBody(agent) },
    });
    return;
  }
  await githubApi(`/repos/${repositoryName()}/issues`, {
    method: "POST",
    body: { title: ROUTE_CONFIG_TITLE, body: routeConfigBody(agent) },
  });
}

function agentLabel(agent) {
  return agent === "old" ? "агент прошлого аккаунта" : "этот Notion-агент";
}

function parseAgentCommand(text) {
  const normalized = String(text || "").trim().toLowerCase();
  const match = normalized.match(/^\/?(?:agent|агент)(?:@\w+)?(?:\s+(current|this|new|notion|этот|новый|old|previous|старый|прошлый))?\s*$/i);
  if (!match) return null;
  const value = match[1] || "show";
  if (["old", "previous", "старый", "прошлый"].includes(value)) return { action: "set", agent: "old" };
  if (["current", "this", "new", "notion", "этот", "новый"].includes(value)) return { action: "set", agent: "current" };
  return { action: "show" };
}

async function transcribeTelegramFile(fileId, preferredName = "") {
  const token = env("TELEGRAM_BOT_TOKEN");
  const file = await telegramApi("getFile", { file_id: fileId });
  const download = await fetch(`${TELEGRAM_FILE_API}/bot${token}/${file.file_path}`);
  if (!download.ok) throw new Error(`Не удалось скачать голосовое: ${download.status}`);
  const audio = await download.blob();
  const form = new FormData();
  form.append("file", audio, normalizeAudioFilename(file.file_path, preferredName));
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "json");
  form.append("language", "ru");
  const response = await fetch(`${GROQ_API}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env("GROQ_API_KEY")}` },
    body: form,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Groq Whisper: ${data.error?.message || response.status}`);
  return String(data.text || "").trim();
}

async function createGitHubIssue(instruction, source, telegramMeta, agent) {
  const compact = instruction.replace(/\s+/g, " ").trim();
  const metadata = JSON.stringify({
    chatId: String(telegramMeta.chatId),
    statusMessageId: Number(telegramMeta.statusMessageId),
    sourceMessageId: Number(telegramMeta.sourceMessageId),
    description: instruction.slice(0, 3000),
    agent,
  });
  const body = [
    "## Задача для KILA",
    "",
    instruction.trim(),
    "",
    "## Исполнитель",
    "",
    agentLabel(agent),
    "",
    "## Источник",
    "",
    `Telegram (${source}). Создано облачным ботом владельца.`,
    "",
    "<!-- KILA_TELEGRAM_META",
    metadata,
    "-->",
  ].join("\n");
  const prefix = agent === "old" ? OLD_AGENT_PREFIX : CURRENT_AGENT_PREFIX;
  const data = await githubApi(`/repos/${repositoryName()}/issues`, {
    method: "POST",
    body: { title: `${prefix} ${compact.slice(0, 72)}`, body },
  });
  return { url: data.html_url, number: data.number };
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
      githubWebhook: Boolean(process.env.GITHUB_WEBHOOK_SECRET),
    },
  });
}

export async function POST(request) {
  const expectedSecret = env("TELEGRAM_WEBHOOK_SECRET", false);
  if (expectedSecret && (request.headers.get("x-telegram-bot-api-secret-token") || "") !== expectedSecret) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let chatId = null;
  let statusMessageId = null;
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

    const agentCommand = parseAgentCommand(text);
    if (agentCommand) {
      if (agentCommand.action === "set") await setActiveAgent(agentCommand.agent);
      const activeAgent = agentCommand.action === "set" ? agentCommand.agent : await getActiveAgent();
      await sendMessage(chatId, [
        `Активный исполнитель: ${agentLabel(activeAgent)}.`,
        "",
        "Переключить:",
        "/agent current — этот Notion-агент",
        "/agent old — агент прошлого аккаунта",
      ].join("\n"));
      return Response.json({ ok: true });
    }

    if (text === "/start" || text === "/status") {
      const activeAgent = await getActiveAgent();
      await sendMessage(chatId, [
        "KILA Cloud Bot работает.",
        `Активный исполнитель: ${agentLabel(activeAgent)}.`,
        "Новые задачи попадают в GitHub и проверяются выбранным агентом.",
        "Команда выбора: /agent",
      ].join("\n"));
      return Response.json({ ok: true });
    }

    const activeAgent = await getActiveAgent();
    const isVoice = Boolean(message.voice?.file_id || message.audio?.file_id);
    const status = await sendMessage(chatId, formatStatus(
      isVoice ? "Голосовая задача" : text,
      isVoice ? "транскрибация" : "подготовка задачи",
      `Исполнитель: ${agentLabel(activeAgent)}`,
    ));
    statusMessageId = status.message_id;

    let instruction = text;
    let source = "текстовое сообщение";
    if (isVoice) {
      const fileId = message.voice?.file_id || message.audio.file_id;
      const preferredName = message.voice ? "voice.ogg" : (message.audio?.file_name || "audio.mp3");
      instruction = await transcribeTelegramFile(fileId, preferredName);
      source = "голосовое сообщение";
      if (!instruction) throw new Error("Не удалось распознать речь");
      await editMessage(chatId, statusMessageId, formatStatus(
        instruction,
        "создание задачи",
        `Исполнитель: ${agentLabel(activeAgent)}`,
      ));
    }

    if (!instruction) throw new Error("Пустое описание задачи");
    const issue = await createGitHubIssue(instruction, source, {
      chatId,
      statusMessageId,
      sourceMessageId: message.message_id,
    }, activeAgent);

    const plan = "Что будет сделано агентом: анализ запроса → загрузка актуальных файлов → внесение изменений → проверка commit → публикация.";
    await editMessage(chatId, statusMessageId, formatStatus(
      instruction,
      "в очереди агента",
      `Исполнитель: ${agentLabel(activeAgent)}\n${plan}\nGitHub: ${issue.url}`,
    ));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("KILA Telegram webhook error", error);
    if (chatId && statusMessageId) {
      try {
        await editMessage(chatId, statusMessageId, formatStatus(
          "Не удалось создать задачу",
          "ошибка",
          error instanceof Error ? error.message : "неизвестная ошибка",
        ));
      } catch (_) {}
    }
    return Response.json({ ok: true });
  }
}
