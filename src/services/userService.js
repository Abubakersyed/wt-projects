const bcrypt = require("bcrypt");
const { readJson, writeJson } = require("../utils/fileStore");

async function createUser({ name, email, password }) {
  const users = readJson("users.json", []);
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    const err = new Error("Email already registered"); err.status = 409; throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = { id: "u" + Date.now(), name, email: email.toLowerCase(), passwordHash: hash, createdAt: new Date().toISOString(), profile: { phone: "", city: "" } };
  users.push(user);
  await writeJson("users.json", users);
  return sanitize(user);
}

async function verifyUser(email, password) {
  const users = readJson("users.json", []);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

function findById(id) {
  const users = readJson("users.json", []);
  const u = users.find((x) => x.id === id);
  return u ? sanitize(u) : null;
}

function sanitize(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

function updateUser(id, updates) {
  const users = readJson("users.json", []);
  const idx = users.findIndex((x) => x.id === id);
  if (idx === -1) { const e = new Error("User not found"); e.status = 404; throw e; }
  if (updates.name) users[idx].name = updates.name;
  if (updates.profile) users[idx].profile = { ...users[idx].profile, ...updates.profile };
  writeJson("users.json", users);
  return sanitize(users[idx]);
}

module.exports = { createUser, verifyUser, findById, updateUser, sanitize };
