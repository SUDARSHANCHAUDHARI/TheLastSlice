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

function effectiveRootTokens(source) {
  const tokens = {};
  for (const match of source.matchAll(/:root\s*\{([\s\S]*?)\}/g)) {
    for (const declaration of match[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      tokens[declaration[1]] = declaration[2].trim();
    }
  }
  return tokens;
}

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
  .filter(
    (url) =>
      !url.startsWith("https://sudarshanchaudhari.github.io/TheLastSlice/") &&
      !url.startsWith("https://sudarshanchaudhari.github.io/TinyChaos/"),
  );
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

const tokens = effectiveRootTokens(css);
for (const [name, expected] of Object.entries({
  "--ink": "#15152a",
  "--paper": "#fff5df",
  "--coral": "#ff5d5d",
  "--blue": "#4f7cff",
  "--butter": "#ffd166",
  "--mint": "#58d6a9",
  "--lilac": "#b695ff",
})) {
  if (tokens[name]?.toLowerCase() !== expected) {
    fail(`${name} must resolve to ${expected}`);
  }
}
if (!/--display:\s*Impact/.test(css)) {
  fail("display typography must use the condensed family stack");
}
if (!/--body:\s*"Arial Rounded MT Bold"/.test(css)) {
  fail("body typography must use the rounded family stack");
}
if (!/body\s*\{[\s\S]*min-width:\s*0;[\s\S]*overflow-x:\s*clip;[\s\S]*overflow-y:\s*auto;/.test(css)) {
  fail("body must preserve vertical scrolling and avoid a positive minimum width");
}
if (!/button:focus-visible,[\s\S]*outline:\s*4px solid var\(--blue\)/.test(css)) {
  fail("focus treatment must use TinyChaos blue");
}
if (!/\.control-button,[\s\S]*\.play-again\s*\{[\s\S]*border:\s*3px solid var\(--ink\)[\s\S]*box-shadow:\s*4px 4px 0 var\(--ink\)/.test(css)) {
  fail("utility controls need heavy ink outlines and solid offsets");
}
if (!html.includes('href="https://sudarshanchaudhari.github.io/TinyChaos/"')) {
  fail("TinyChaos gallery link is required");
}
if (!html.includes("TheLastSlice · by Sudarshan Chaudhari")) {
  fail("author attribution is required");
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
