#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const [, , packageDirArg, ...extraArgs] = process.argv;

if (!packageDirArg) {
  console.error("Usage: node scripts/publish-package.mjs <package-dir> [npm publish args...]");
  process.exit(1);
}

const packageDir = path.resolve(process.cwd(), packageDirArg);

const child = spawn("npm", ["publish", ...extraArgs], {
  cwd: packageDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(`Failed to run npm publish in ${packageDir}:`, error);
  process.exit(1);
});
