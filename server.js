import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT) || 8080;
const ROOT = fileURLToPath(new URL("./public/", import.meta.url));

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function safeGameUrl(value, fallback) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function jsonResponse(res, status, body) {
  res.writeHead(status, {
    "content-type": MIME_TYPES[".json"],
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(body));
}

async function staticResponse(req, res, pathname) {
  const filename = pathname === "/" ? "index.html" : pathname.slice(1);
  const resolved = normalize(join(ROOT, filename));

  if (!resolved.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const content = await readFile(resolved);
    res.writeHead(200, {
      "content-type": MIME_TYPES[extname(resolved)] || "application/octet-stream",
      "cache-control": "public, max-age=300"
    });
    res.end(content);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");

  if (url.pathname === "/health") {
    jsonResponse(res, 200, { ok: true });
    return;
  }

  if (url.pathname === "/config") {
    jsonResponse(res, 200, {
      ok: true,
      towerDefenseUrl: safeGameUrl(
        process.env.TOWER_DEFENSE_URL,
        "https://tower-defense-web.onrender.com/"
      ),
      taptilesUrl: safeGameUrl(process.env.TAPTILES_URL, "#")
    });
    return;
  }

  await staticResponse(req, res, url.pathname);
}).listen(PORT, () => {
  console.log(`Game Hub listening on ${PORT}`);
});
