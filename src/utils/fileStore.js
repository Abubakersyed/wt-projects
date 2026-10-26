const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name) {
  ensureDir();
  return path.join(DATA_DIR, name);
}

const locks = {};
let globalLock = Promise.resolve();
function withGlobalLock(fn) {
  const prev = globalLock;
  let resolve;
  globalLock = new Promise((r) => (resolve = r));
  return prev.then(() => {
    try { return fn(); }
    finally { resolve(); }
  }).catch((e) => { resolve(); throw e; });
}
function withLock(name, fn) {
  // simple serialized writes per file
  if (!locks[name]) locks[name] = Promise.resolve();
  const prev = locks[name];
  let resolve;
  locks[name] = new Promise((r) => (resolve = r));
  return prev.then(() => {
    try { return fn(); }
    finally { resolve(); }
  }).catch((e) => { resolve(); throw e; });
}

function readJson(name, fallback = []) {
  const p = filePath(name);
  if (!fs.existsSync(p)) return fallback;
  try {
    const raw = fs.readFileSync(p, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("readJson error", name, e.message);
    return fallback;
  }
}

function writeJson(name, data) {
  return withLock(name, () => {
    const p = filePath(name);
    const tmp = p + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, p);
  });
}

module.exports = { readJson, writeJson, filePath, DATA_DIR, withGlobalLock };
