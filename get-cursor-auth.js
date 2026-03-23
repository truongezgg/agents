#!/usr/bin/env node
const { accessSync, constants } = require("fs");
const { homedir } = require("os");
const { join } = require("path");
const { execFileSync } = require("child_process");

const ACCESS_TOKEN_KEYS = ["cursorAuth/accessToken", "cursorAuth/token"];
const MACHINE_ID_KEYS = [
  "storage.serviceMachineId",
  "storage.machineId",
  "telemetry.machineId",
];

function getCandidatePaths(platform) {
  const home = homedir();

  if (platform === "darwin") {
    return [
      join(home, "Library/Application Support/Cursor/User/globalStorage/state.vscdb"),
      join(home, "Library/Application Support/Cursor - Insiders/User/globalStorage/state.vscdb"),
    ];
  }

  if (platform === "win32") {
    const appData = process.env.APPDATA || join(home, "AppData", "Roaming");
    const localAppData = process.env.LOCALAPPDATA || join(home, "AppData", "Local");
    return [
      join(appData, "Cursor", "User", "globalStorage", "state.vscdb"),
      join(appData, "Cursor - Insiders", "User", "globalStorage", "state.vscdb"),
      join(localAppData, "Cursor", "User", "globalStorage", "state.vscdb"),
      join(localAppData, "Programs", "Cursor", "User", "globalStorage", "state.vscdb"),
    ];
  }

  return [
    join(home, ".config/Cursor/User/globalStorage/state.vscdb"),
    join(home, ".config/cursor/User/globalStorage/state.vscdb"),
  ];
}

function pickDbPath(candidates) {
  for (const p of candidates) {
    try {
      accessSync(p, constants.R_OK);
      return p;
    } catch {}
  }
  return null;
}

function normalize(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "string" ? parsed : trimmed;
  } catch {
    return trimmed;
  }
}

function queryKey(dbPath, key) {
  try {
    const sql = `SELECT value FROM itemTable WHERE key='${key}' LIMIT 1`;
    const out = execFileSync("sqlite3", [dbPath, sql], {
      encoding: "utf8",
      timeout: 10000,
    }).trim();
    return out ? normalize(out) : null;
  } catch {
    return null;
  }
}

function firstValue(dbPath, keys) {
  for (const key of keys) {
    const v = queryKey(dbPath, key);
    if (v) return v;
  }
  return null;
}

function main() {
  const candidates = getCandidatePaths(process.platform);
  const dbPath = pickDbPath(candidates);

  if (!dbPath) {
    console.error("Cursor DB not found. Checked:");
    for (const p of candidates) console.error(`- ${p}`);
    process.exit(1);
  }

  const accessToken = firstValue(dbPath, ACCESS_TOKEN_KEYS);
  const machineId = firstValue(dbPath, MACHINE_ID_KEYS);

  if (!accessToken || !machineId) {
    console.error("Found DB but token/machineId missing.");
    console.error(`dbPath: ${dbPath}`);
    process.exit(2);
  }

  process.stdout.write(
    JSON.stringify({ dbPath, accessToken, machineId }, null, 2) + "\n",
  );
}

main();
