import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TELEGRAM_API = "https:" + "//api.telegram.org";

function env(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function verifySignature(rawBody, signature, secret) {
  if (!signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function parseTelegramMeta(issueBody = "") {
  const match = issueBody.match(/<!-- KILA_TELEGRAM_META\s*\n([\s\S]*?)\n-->/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch (_) { return null; }
}

function finalText(meta, stage, details = "") {
  const description = String(meta.description || "Задача").trim().slice(0, 3000);
  const text = `Задача:\n${description}\n\nСтадия: ${stage}${details ? `\n\n${details}` : ""}`;
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

async function editStatus(meta, stage, details = "") {
  return telegramApi("editMessageText", {
    chat_id: meta.chatId,
    message_id: meta.statusMessageId,
    text: finalText(meta, stage, details),
    disable_web_page_preview: true,
  });
}

async function deleteSourceMessage(meta) {
  if (!meta.sourceMessageId) return;
  try { await telegramApi("deleteMessage", { chat_id: meta.chatId, message_id: meta.sourceMessageId }); } catch (_) {}
}

export async function POST(request) {
  const secret = env("GITHUB_WEBHOOK_SECRET");
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256") || "";
  if (!verifySignature(rawBody, signature, secret)) {
    return Response.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event") || "";
  const payload = JSON.parse(rawBody);
  const issue = payload.issue;
  if (!issue?.title?.startsWith("[VOICE TASK]")) return Response.json({ ok: true, ignored: true });
  const meta = parseTelegramMeta(issue.body || "");
  if (!meta) return Response.json({ ok: true, ignored: true });

  if (event === "issue_comment" && payload.action === "created") {
    const body = String(payload.comment?.body || "").trim();
    if (body.startsWith("[KILA_STAGE]")) {
      const stage = body.slice("[KILA_STAGE]".length).trim() || "выполнение";
      await editStatus(meta, stage);
    } else if (body.startsWith("[KILA_DONE]")) {
      const details = body.slice("[KILA_DONE]".length).trim();
      await editStatus(meta, "завершение", details);
    }
  }

  if (event === "issues" && payload.action === "closed") {
    await deleteSourceMessage(meta);
    await editStatus(meta, "выполнено");
  }
  if (event === "issues" && payload.action === "reopened") {
    await editStatus(meta, "задача открыта повторно");
  }
  return Response.json({ ok: true });
}
