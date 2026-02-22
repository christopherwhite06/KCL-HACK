import https from "node:https";
import { get as cacheGet, set as cacheSet, cacheKey as buildCacheKey } from "./cache.js";

const DEFAULT_BASE_URL = "https://api.scansan.com";
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

function getBaseUrl() {
  return process.env.SCANSAN_BASE_URL || DEFAULT_BASE_URL;
}

function getApiKey() {
  const key = process.env.SCANSAN_API_KEY;
  if (!key) throw new Error("SCANSAN_API_KEY is not set");
  return key;
}

/**
 * Sleep for ms milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch JSON from Scansan API with retries on rate limit (429) or server errors (5xx).
 * Retries up to MAX_RETRIES times with RETRY_DELAY_MS before each retry.
 * @param {string} path - API path (e.g. /property or /search)
 * @param {Record<string, string>} [params] - Query parameters
 * @returns {Promise<{ success: true, data: unknown } | { success: false, error: string, statusCode?: number }>}
 */
export async function fetchFromScansan(path, params = {}) {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();
  const query = new URLSearchParams(params).toString();
  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}${query ? `?${query}` : ""}`;

  let lastError = "";
  let lastStatus = 0;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 1) {
      await sleep(RETRY_DELAY_MS);
    }

    try {
      const result = await doRequest(url, apiKey);
      if (result.ok) {
        return { success: true, data: result.data };
      }
      lastError = result.error || `HTTP ${result.statusCode}`;
      lastStatus = result.statusCode;

      const isRateLimit = result.statusCode === 429;
      const isServerError = result.statusCode >= 500 && result.statusCode < 600;
      if (!isRateLimit && !isServerError) {
        return { success: false, error: lastError, statusCode: result.statusCode };
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  return { success: false, error: lastError, statusCode: lastStatus };
}

/**
 * @param {string} url
 * @param {string} apiKey
 * @returns {Promise<{ ok: boolean, statusCode: number, data?: unknown, error?: string }>}
 */
function doRequest(url, apiKey) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const useBearer = process.env.SCANSAN_AUTH_BEARER === "true";
    const authHeader = process.env.SCANSAN_AUTH_HEADER || "X-Auth-Token";
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(useBearer
          ? { Authorization: `Bearer ${apiKey}` }
          : { [authHeader]: apiKey }),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        let data;
        try {
          data = body ? JSON.parse(body) : null;
        } catch {
          data = body;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, statusCode: res.statusCode, data });
        } else {
          resolve({
            ok: false,
            statusCode: res.statusCode,
            data,
            error: data?.message || data?.error || body || `HTTP ${res.statusCode}`,
          });
        }
      });
    });

    req.on("error", (err) => {
      resolve({ ok: false, statusCode: 0, error: err.message });
    });

    req.setTimeout(30000, () => {
      req.destroy();
      resolve({ ok: false, statusCode: 0, error: "Request timeout" });
    });

    req.end();
  });
}

/**
 * Get data from cache or fetch from Scansan (with retry). Stores result in cache on success.
 * @param {string} path - API path
 * @param {Record<string, string>} [params] - Query parameters
 * @returns {Promise<{ success: true, data: unknown, cached: boolean } | { success: false, error: string, statusCode?: number }>}
 */
export async function getCachedOrFetch(path, params = {}) {
  const key = buildCacheKey(path, params);
  const cached = cacheGet(key);
  if (cached !== undefined) {
    return { success: true, data: cached, cached: true };
  }

  const result = await fetchFromScansan(path, params);
  if (result.success) {
    cacheSet(key, result.data);
    return { ...result, cached: false };
  }
  return result;
}
