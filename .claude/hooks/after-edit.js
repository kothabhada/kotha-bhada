#!/usr/bin/env node
// Kotha Bhada — PostToolUse hook.
// Fires after Claude edits a file. Two jobs:
//   1. If app.js changed, run `node --check` and report any syntax error.
//   2. If a cache-busted asset (app.js/styles.css/config.js/data.js) changed,
//      bump every ?v=N in index.html so the browser never serves a stale file.
// Reads the tool-call JSON from stdin (Claude Code passes it automatically).

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PROJECT = path.resolve(__dirname, "..", "..");
const INDEX = path.join(PROJECT, "index.html");
// Editing any of these should trigger a cache-buster bump.
const BUSTED = new Set(["app.js", "styles.css", "config.js", "data.js"]);

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

let input = {};
try {
  input = JSON.parse(readStdin() || "{}");
} catch {
  process.exit(0); // not our concern — let the edit through quietly
}

const filePath = input?.tool_input?.file_path || "";
if (!filePath) process.exit(0);
const base = path.basename(filePath);

const notes = [];

// --- Job 1: syntax-check app.js ---------------------------------------------
if (base === "app.js") {
  try {
    execSync(`node --check "${path.join(PROJECT, "app.js")}"`, { stdio: "pipe" });
  } catch (e) {
    const msg = (e.stderr || e.stdout || e.message || "").toString().trim();
    // exit 2 surfaces stderr back to Claude so the error gets fixed
    console.error(`⚠️  app.js has a syntax error — fix before reloading:\n${msg}`);
    process.exit(2);
  }
}

// --- Job 2: bump cache-busters in index.html --------------------------------
if (BUSTED.has(base)) {
  try {
    let html = fs.readFileSync(INDEX, "utf8");
    const versions = [...html.matchAll(/\?v=(\d+)/g)].map((m) => Number(m[1]));
    if (versions.length) {
      const next = Math.max(...versions) + 1;
      html = html.replace(/\?v=\d+/g, `?v=${next}`);
      fs.writeFileSync(INDEX, html);
      notes.push(`🔄 Bumped cache-buster to ?v=${next} in index.html (reload to see ${base} changes).`);
    }
  } catch {
    /* index.html missing or unreadable — skip silently */
  }
}

if (notes.length) console.log(notes.join("\n"));
process.exit(0);
