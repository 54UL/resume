import { safeGet, safeSet } from "./storage.js";

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export let PALETTES = {};

export async function loadPalettes(){
  PALETTES = await fetch("./domain/palettes.json").then(r => r.json());
}

export const TOKEN_META = [
  { key: "canvas",     cssVar: "--canvas",      group: "Surfaces", name: "Canvas",     hint: "Page background" },
  { key: "surface",    cssVar: "--surface",     group: "Surfaces", name: "Surface",    hint: "Card background" },
  { key: "surfaceAlt", cssVar: "--surface-alt", group: "Surfaces", name: "Surface Alt",hint: "Inset panels & tags" },
  { key: "border",     cssVar: "--border",      group: "Surfaces", name: "Border",     hint: "Hairlines & outlines" },
  { key: "ink",        cssVar: "--ink",         group: "Text",     name: "Ink",        hint: "Primary text" },
  { key: "inkMuted",   cssVar: "--ink-muted",   group: "Text",     name: "Ink Muted",  hint: "Secondary text" },
  { key: "accent",     cssVar: "--accent",      group: "Accents",  name: "Accent",     hint: "Primary highlight" },
  { key: "highlight",  cssVar: "--highlight",   group: "Accents",  name: "Highlight",  hint: "Secondary highlight" },
  { key: "caution",    cssVar: "--caution",     group: "Accents",  name: "Caution",    hint: "Tertiary / status pop" },
];

function computeTokens(p, mode) {
  const dark = mode === "dark";
  return {
    canvas:     hslToHex(p.neutralH, p.neutralS, dark ? 9  : 96),
    surface:    hslToHex(p.neutralH, p.neutralS, dark ? 14 : 100),
    surfaceAlt: hslToHex(p.neutralH, p.neutralS, dark ? 19 : 93),
    border:     hslToHex(p.neutralH, Math.min(p.neutralS + 4, 100), dark ? 27 : 87),
    ink:        hslToHex(p.neutralH, Math.min(p.neutralS, 14), dark ? 93 : 15),
    inkMuted:   hslToHex(p.neutralH, Math.min(p.neutralS, 10), dark ? 66 : 40),
    accent:     hslToHex(p.accentH, p.accentS, dark ? 64 : 40),
    highlight:  hslToHex(p.highlightH, p.highlightS, dark ? 64 : 38),
    caution:    hslToHex(p.cautionH, p.cautionS, dark ? 66 : 42),
  };
}

export const themeState = { preset: "copper", mode: "dark", overrides: {} };

export function loadTheme(){
  try {
    const raw = safeGet("resume-theme");
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && PALETTES[saved.preset]) {
      themeState.preset = saved.preset;
      themeState.mode = saved.mode || "auto";
      themeState.overrides = saved.overrides || {};
    }
  } catch(e) {}
}

export function persistTheme(){
  safeSet("resume-theme", JSON.stringify(themeState));
}

export function systemPrefersDark(){
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function effectiveMode(){
  return themeState.mode === "auto" ? (systemPrefersDark() ? "dark" : "light") : themeState.mode;
}

export function activeTokens(){
  return { ...computeTokens(PALETTES[themeState.preset], effectiveMode()), ...themeState.overrides };
}

export function paletteSwatchColor(p){
  return hslToHex(p.accentH, Math.max(p.accentS, 25), 48);
}
