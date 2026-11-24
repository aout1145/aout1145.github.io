// Astro 会把 DOCTYPE 规范化成 HTML5，这里改回 HTML 3.2 的公开标识，
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DOCTYPE = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">';
const ROOT = "dist";

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let changed = 0;
for (const file of walk(ROOT)) {
  if (!file.endsWith(".html")) continue;
  const src = readFileSync(file, "utf8");
  if (!src.startsWith("<!DOCTYPE html>")) continue;
  writeFileSync(file, src.replace("<!DOCTYPE html>", DOCTYPE));
  changed += 1;
}

console.log(`doctype fixup: ${changed} html file(s)`);
