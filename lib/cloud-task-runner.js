const GITHUB_API = "https:" + "//api.github.com";
const GROQ_API = "https:" + "//api.groq.com/openai/v1";
const GITHUB_WEB = "https:" + "//github.com";
const EDITABLE_PREFIXES = ["app/", "components/", "lib/"];
const BLOCKED_PREFIXES = ["app/api/", "lib/cloud-task-runner.js"];
const TEXT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".css", ".json", ".md"]);

function env(name, fallback = "") {
  const value = process.env[name]?.trim() || fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function repository() {
  return env("GITHUB_REPOSITORY", "KillaRZVR/kila-portfolio");
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
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(`GitHub: ${data?.message || response.status}`);
  return data;
}

async function addComment(issueNumber, body) {
  return github(`/repos/${repository()}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

function extension(path) {
  const index = path.lastIndexOf(".");
  return index >= 0 ? path.slice(index).toLowerCase() : "";
}

function isEditablePath(path, existingPaths) {
  if (!existingPaths.has(path)) return false;
  if (!EDITABLE_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  if (BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  return TEXT_EXTENSIONS.has(extension(path));
}

async function findOldestTask() {
  const issues = await github(`/repos/${repository()}/issues?state=open&sort=created&direction=asc&per_page=50`);
  return issues.find((issue) => !issue.pull_request && issue.title?.startsWith("[VOICE TASK]")) || null;
}

async function loadRepositoryContext() {
  const branch = env("GITHUB_BRANCH", "main");
  const tree = await github(`/repos/${repository()}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  const candidates = tree.tree
    .filter((entry) => entry.type === "blob" && entry.size <= 120000)
    .filter((entry) => EDITABLE_PREFIXES.some((prefix) => entry.path.startsWith(prefix)))
    .filter((entry) => !BLOCKED_PREFIXES.some((prefix) => entry.path.startsWith(prefix)))
    .filter((entry) => TEXT_EXTENSIONS.has(extension(entry.path)))
    .sort((a, b) => a.path.localeCompare(b.path));
  const files = [];
  let totalCharacters = 0;
  for (const entry of candidates) {
    if (totalCharacters >= 110000) break;
    const encodedPath = entry.path.split("/").map(encodeURIComponent).join("/");
    const file = await github(`/repos/${repository()}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`);
    if (!file.content || file.encoding !== "base64") continue;
    const content = Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8");
    if (totalCharacters + content.length > 120000) continue;
    files.push({ path: entry.path, content });
    totalCharacters += content.length;
  }
  return files;
}

function extractTask(issue) {
  const body = String(issue.body || "");
  const sourceSection = body.indexOf("\n## Источник");
  const beforeSource = sourceSection >= 0 ? body.slice(0, sourceSection) : body;
  return beforeSource.replace(/^## Задача для KILA\s*/i, "").trim();
}

function extractTelegramMeta(issue) {
  const body = String(issue.body || "");
  const match = body.match(/<!-- KILA_TELEGRAM_META\s*\n([\s\S]*?)\n-->/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch (_) { return null; }
}

async function planChanges(task, files) {
  const model = env("GROQ_CODE_MODEL", "llama-3.3-70b-versatile");
  const fileContext = files.map((file) => `--- ${file.path} ---\n${file.content}`).join("\n\n");
  const response = await fetch(`${GROQ_API}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env("GROQ_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 12000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Ты безопасный coding worker портфолио KILA. Верни только JSON: {\"files\":[{\"path\":\"...\",\"content\":\"полный новый текст файла\"}],\"summary\":\"краткий итог\"}. Изменяй минимум файлов. Не меняй API, webhook, секреты, зависимости и инфраструктуру. Не удаляй файлы.",
        },
        {
          role: "user",
          content: `Задача владельца:\n${task}\n\nДоступные файлы:\n${fileContext}`,
        },
      ],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Groq coding: ${data.error?.message || response.status}`);
  const raw = String(data.choices?.[0]?.message?.content || "").trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  const result = JSON.parse(raw);
  if (!Array.isArray(result.files) || !result.files.length) throw new Error("Groq не вернул изменения файлов");
  return result;
}

function validateChanges(result, files) {
  const existingPaths = new Set(files.map((file) => file.path));
  if (result.files.length > 8) throw new Error("Слишком много изменяемых файлов");
  const seen = new Set();
  return result.files.map((file) => {
    const path = String(file.path || "");
    const content = String(file.content ?? "");
    if (seen.has(path)) throw new Error(`Повтор файла: ${path}`);
    if (!isEditablePath(path, existingPaths)) throw new Error(`Запрещённый путь: ${path}`);
    if (!content.trim()) throw new Error(`Пустой файл: ${path}`);
    seen.add(path);
    return { path, content };
  });
}

async function pushChanges(files, task) {
  const branch = env("GITHUB_BRANCH", "main");
  const repo = repository();
  const ref = await github(`/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
  const parentSha = ref.object.sha;
  const parentCommit = await github(`/repos/${repo}/git/commits/${parentSha}`);
  const treeItems = [];
  for (const file of files) {
    const blob = await github(`/repos/${repo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: file.content, encoding: "utf-8" }),
    });
    treeItems.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  const tree = await github(`/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree: treeItems }),
  });
  const commit = await github(`/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: `Telegram task: ${task.replace(/\s+/g, " ").slice(0, 72)}`,
      tree: tree.sha,
      parents: [parentSha],
    }),
  });
  await github(`/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  return { sha: commit.sha, url: `${GITHUB_WEB}/${repo}/commit/${commit.sha}` };
}

export async function runOldestVoiceTask() {
  const issue = await findOldestTask();
  if (!issue) return { found: false };
  const task = extractTask(issue);
  const telegramMeta = extractTelegramMeta(issue);
  try {
    await addComment(issue.number, "[KILA_STAGE] анализ задачи");
    const context = await loadRepositoryContext();
    const planned = await planChanges(task, context);
    const changes = validateChanges(planned, context);
    await addComment(issue.number, "[KILA_STAGE] внесение изменений");
    const commit = await pushChanges(changes, task);
    await addComment(issue.number, "[KILA_STAGE] проверка результата");
    const summary = String(planned.summary || "Изменения внесены и опубликованы.").slice(0, 1000);
    await addComment(issue.number, `[KILA_DONE] ${summary}\n\nCommit: ${commit.url}`);
    await github(`/repos/${repository()}/issues/${issue.number}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "closed", state_reason: "completed" }),
    });
    return { found: true, issueNumber: issue.number, task, summary, commit, telegramMeta };
  } catch (error) {
    await addComment(issue.number, `[KILA_STAGE] ошибка автоматического запуска: ${error instanceof Error ? error.message : "неизвестная ошибка"}`);
    throw error;
  }
}
