import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCachedOrFetch } from "./lib/scansan.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from backend or project root (so root .env works when running from backend)
async function loadEnv() {
  try {
    const dotenv = await import("dotenv");
    const backendEnv = path.join(__dirname, ".env");
    const rootEnv = path.join(__dirname, "..", ".env");
    dotenv.config({ path: rootEnv });
    dotenv.config({ path: backendEnv });
  } catch {
    // dotenv optional if not installed
  }
}
await loadEnv();

const PORT = Number(process.env.PORT) || 3001;

function parseScansanRequest(url) {
  const pathname = url.split("?")[0];
  const base = "/api/scansan";
  if (!pathname.startsWith(base)) return null;
  const idx = url.indexOf("?");
  const params = {};
  if (idx !== -1) {
    const qs = url.slice(idx + 1);
    for (const part of qs.split("&")) {
      const eq = part.indexOf("=");
      if (eq === -1) continue;
      const k = decodeURIComponent(part.slice(0, eq).replace(/\+/g, " "));
      const v = decodeURIComponent(part.slice(eq + 1).replace(/\+/g, " "));
      params[k] = v;
    }
  }
  const rawPath = params.path || "";
  const apiPath = "/" + rawPath.replace(/^\/+/, "") || "/";
  const { path: _p, ...rest } = params;
  return { path: apiPath, params: rest };
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url?.startsWith("/api/health")) {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, service: "roomr-backend" }));
    return;
  }

  if (req.method === "GET" && req.url?.startsWith("/api/scansan")) {
    const parsed = parseScansanRequest(req.url);
    if (!parsed) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: "Bad request",
          usage: "GET /api/scansan?path=/your/endpoint&param1=value1",
        })
      );
      return;
    }

    if (!process.env.SCANSAN_API_KEY) {
      res.writeHead(503);
      res.end(JSON.stringify({ error: "SCANSAN_API_KEY is not configured" }));
      return;
    }

    try {
      const result = await getCachedOrFetch(parsed.path, parsed.params);
      if (result.success) {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            ok: true,
            cached: result.cached,
            data: result.data,
          })
        );
        return;
      }
      res.writeHead(result.statusCode && result.statusCode >= 400 ? result.statusCode : 502);
      res.end(JSON.stringify({ error: result.error, statusCode: result.statusCode }));
      return;
    } catch (err) {
      res.writeHead(500);
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : "Internal server error",
        })
      );
      return;
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
