export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TELEGRAM_API = "https:" + "//api.telegram.org";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const providedSecret = requestUrl.searchParams.get("secret") || "";
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || "";
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";

  if (!expectedSecret || !token) {
    return Response.json(
      { ok: false, error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_WEBHOOK_SECRET in Vercel" },
      { status: 500 },
    );
  }

  if (providedSecret !== expectedSecret) {
    return Response.json({ ok: false, error: "Invalid setup secret" }, { status: 401 });
  }

  const webhookUrl = `${requestUrl.origin}/api/telegram`;
  const response = await fetch(`${TELEGRAM_API}/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: expectedSecret,
      allowed_updates: ["message", "edited_message"],
      drop_pending_updates: true,
    }),
  });
  const telegram = await response.json();

  return Response.json(
    {
      ok: Boolean(response.ok && telegram.ok),
      webhookUrl,
      telegram: {
        ok: Boolean(telegram.ok),
        description: telegram.description || null,
      },
    },
    { status: response.ok && telegram.ok ? 200 : 502 },
  );
}
