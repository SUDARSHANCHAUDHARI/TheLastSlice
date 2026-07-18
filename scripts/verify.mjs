import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const requiredFiles = [
  "index.html",
  "style.css",
  "script.js",
  "README.md",
  ".gitignore",
  "AGENTS.md",
];

const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);

const files = new Map();
for (const relativePath of requiredFiles) {
  try {
    const contents = readFileSync(join(root, relativePath), "utf8");
    files.set(relativePath, contents);
    if (!contents.trim()) {
      fail(`${relativePath} is empty`);
    }
  } catch {
    fail(`${relativePath} is missing`);
  }
}

if (failures.length === 0) {
  pass("required production files exist");
}

const html = files.get("index.html") ?? "";
const css = files.get("style.css") ?? "";
const javascript = files.get("script.js") ?? "";

const syntaxCheck = spawnSync(process.execPath, ["--check", join(root, "script.js")], {
  encoding: "utf8",
});
if (syntaxCheck.status === 0) {
  pass("JavaScript syntax is valid");
} else {
  fail(`JavaScript syntax check failed: ${syntaxCheck.stderr.trim()}`);
}

const requiredHtml = [
  ["<!doctype html>", "HTML5 doctype"],
  ['lang="en"', "document language"],
  ['href="style.css"', "relative stylesheet"],
  ['src="script.js"', "relative script"],
  ['aria-live="polite"', "live status region"],
  ['aria-modal="true"', "modal celebration semantics"],
  ["“You earned the last slice.”", "required celebration message"],
];
for (const [needle, label] of requiredHtml) {
  if (!html.toLowerCase().includes(needle.toLowerCase())) {
    fail(`missing ${label}`);
  }
}

const absoluteRuntimeAssets = [...html.matchAll(/(?:src|href)="(https?:\/\/[^\"]+)"/gi)]
  .map((match) => match[1])
  .filter((url) => !url.startsWith("https://sudarshanchaudhari.github.io/TheLastSlice/"));
if (absoluteRuntimeAssets.length > 0) {
  fail(`unexpected external runtime assets: ${absoluteRuntimeAssets.join(", ")}`);
} else {
  pass("runtime assets are local and GitHub Pages-safe");
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const idReferences = [
  ...html.matchAll(/(?:href="#|aria-(?:labelledby|describedby)="|for=")([^"]+)"/g),
].flatMap((match) => match[1].split(/\s+/));
const missingReferences = idReferences.filter((reference) => !ids.includes(reference));
if (duplicateIds.length > 0) {
  fail(`duplicate HTML IDs: ${[...new Set(duplicateIds)].join(", ")}`);
}
if (missingReferences.length > 0) {
  fail(`unresolved HTML references: ${[...new Set(missingReferences)].join(", ")}`);
}
if (duplicateIds.length === 0 && missingReferences.length === 0) {
  pass("HTML IDs and accessibility references resolve");
}

const buttonsWithoutType = [...html.matchAll(/<button\b([^>]*)>/g)]
  .filter((match) => !/\btype="button"/.test(match[1]));
if (buttonsWithoutType.length > 0) {
  fail(`${buttonsWithoutType.length} button(s) are missing type="button"`);
} else {
  pass("buttons use explicit non-submitting types");
}

const expectedGags = [
  "grab",
  "dodge",
  "box-close",
  "fight",
  "cheese",
  "hide",
  "disguise",
  "carrier",
  "legs",
  "fakes",
];
for (const gag of expectedGags) {
  if (!javascript.includes(`id: "${gag}"`) || !css.includes(`scene-${gag}`)) {
    fail(`gag is not fully wired: ${gag}`);
  }
}

const interactionMarkers = [
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointercancel",
  "createOscillator",
  "ATTEMPTS_TO_ESCAPE = 10",
  "ATTEMPTS_TO_WIN = 15",
  "state.fugitive = true",
  "state.earned = true",
  'setAttribute("inert", "")',
];
for (const marker of interactionMarkers) {
  if (!javascript.includes(marker)) {
    fail(`missing interaction or milestone marker: ${marker}`);
  }
}
if (expectedGags.every((gag) => javascript.includes(`id: "${gag}"`) && css.includes(`scene-${gag}`))) {
  pass("all ten gags are wired to visual scenes");
}

let braceBalance = 0;
for (const character of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
  if (character === "{") braceBalance += 1;
  if (character === "}") braceBalance -= 1;
  if (braceBalance < 0) break;
}
if (braceBalance !== 0) {
  fail(`CSS block balance is ${braceBalance}, expected 0`);
} else {
  pass("CSS blocks are balanced");
}

if (!css.includes("@media (prefers-reduced-motion: reduce)")) {
  fail("reduced-motion stylesheet support is missing");
} else {
  pass("reduced-motion support is present");
}

const keyframes = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => match[1]);
const unusedKeyframes = keyframes.filter(
  (name) => !new RegExp(`animation(?:-name)?\\s*:[^;{}]*\\b${name}\\b`).test(css),
);
if (unusedKeyframes.length > 0) {
  fail(`unused keyframes: ${unusedKeyframes.join(", ")}`);
} else {
  pass(`${keyframes.length} animation definitions are referenced`);
}

if (failures.length > 0) {
  console.error("\nProduction verification failed:");
  failures.forEach((message) => console.error(`✗ ${message}`));
  process.exit(1);
}

console.log("\nThe Last Slice is statically ready for production.");
