const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const fontsDir = path.join(root, "public", "fonts");
const target = path.join(fontsDir, "Xanmono-Regular.ttf");

if (fs.existsSync(target)) process.exit(0);

const sources = [
  "https://dl.dafont.com/dl/?f=xanmono",
  "https://fonts-online.ru/fonts/xanmono/download",
];

function findFont(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = findFont(entryPath);
      if (nested) return nested;
    } else if (entry.name.toLowerCase() === "xanmono-regular.ttf") {
      return entryPath;
    }
  }
  return null;
}

async function downloadFont() {
  fs.mkdirSync(fontsDir, { recursive: true });
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "xanmono-"));
  const archivePath = path.join(workDir, "xanmono.zip");
  const extractDir = path.join(workDir, "files");
  let downloaded = false;

  for (const source of sources) {
    try {
      const response = await fetch(source, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "follow" });
      if (!response.ok) continue;
      fs.writeFileSync(archivePath, Buffer.from(await response.arrayBuffer()));
      downloaded = true;
      break;
    } catch (_) {}
  }

  if (!downloaded) throw new Error("Не удалось скачать архив Xanmono");
  fs.mkdirSync(extractDir, { recursive: true });

  if (process.platform === "win32") {
    const escapedArchive = archivePath.replace(/'/g, "''");
    const escapedExtract = extractDir.replace(/'/g, "''");
    const result = spawnSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", `Expand-Archive -LiteralPath '${escapedArchive}' -DestinationPath '${escapedExtract}' -Force`], { stdio: "ignore" });
    if (result.status !== 0) throw new Error("Не удалось распаковать Xanmono");
  } else {
    const result = spawnSync("unzip", ["-o", archivePath, "-d", extractDir], { stdio: "ignore" });
    if (result.status !== 0) throw new Error("Не удалось распаковать Xanmono");
  }

  const fontPath = findFont(extractDir);
  if (!fontPath) throw new Error("Xanmono-Regular.ttf не найден в архиве");
  fs.copyFileSync(fontPath, target);
  fs.rmSync(workDir, { recursive: true, force: true });
  console.log("Xanmono установлен локально.");
}

downloadFont().catch((error) => {
  console.warn(`Xanmono: ${error.message}. Используется резервный моноширинный шрифт.`);
  process.exit(0);
});
