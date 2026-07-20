export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GITHUB_API = "https:" + "//api.github.com";

function env(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function github(path, options = {}) {
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`GitHub: ${data.message || response.status}`);
  return data;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const providedSecret = requestUrl.searchParams.get("secret") || "";
  const webhookSecret = env("GITHUB_WEBHOOK_SECRET");
  if (providedSecret !== webhookSecret) {
    return Response.json({ ok: false, error: "Invalid setup secret" }, { status: 401 });
  }

  const repository = process.env.GITHUB_REPOSITORY?.trim() || "KillaRZVR/kila-portfolio";
  const callbackUrl = `${requestUrl.origin}/api/github/status`;
  const hooks = await github(`/repos/${repository}/hooks?per_page=100`);
  const existing = hooks.find((hook) => hook.config?.url === callbackUrl);
  const config = { url: callbackUrl, content_type: "json", secret: webhookSecret, insecure_ssl: "0" };

  let result;
  let action;
  if (existing) {
    result = await github(`/repos/${repository}/hooks/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ active: true, events: ["issues", "issue_comment"], config }),
    });
    action = "updated";
  } else {
    result = await github(`/repos/${repository}/hooks`, {
      method: "POST",
      body: JSON.stringify({ name: "web", active: true, events: ["issues", "issue_comment"], config }),
    });
    action = "created";
  }
  return Response.json({ ok: true, action, hookId: result.id, callbackUrl });
}
