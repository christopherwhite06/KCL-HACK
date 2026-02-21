import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), ".data");
const CACHE_FILE = path.join(CACHE_DIR, "scansan-cache.json");

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days optional TTL; we still return stored if present unless you want to invalidate

function ensureDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function loadCache() {
  ensureDir();
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    const raw = fs.readFileSync(CACHE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCache(data) {
  ensureDir();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 0), "utf8");
}

/**
 * Get cached value for key. Returns undefined if missing.
 * @param {string} key
 * @returns {unknown | undefined}
 */
export function get(key) {
  const data = loadCache();
  const entry = data[key];
  if (!entry) return undefined;
  return entry.data;
}

/**
 * Set cached value for key.
 * @param {string} key
 * @param {unknown} value
 */
export function set(key, value) {
  const data = loadCache();
  data[key] = { data: value, storedAt: Date.now() };
  saveCache(data);
}

/**
 * Build a stable cache key from path and query params.
 * @param {string} path
 * @param {Record<string, string>} params
 * @returns {string}
 */
export function cacheKey(pathSegment, params = {}) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");
  return pathSegment + (sorted ? `?${sorted}` : "");
}
