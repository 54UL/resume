function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export const PALETTES = {
  graphite: { label: "Graphite",  neutralH: 213, neutralS: 6,  accentH: 213, accentS: 6,  highlightH: 213, highlightS: 6,  cautionH: 213, cautionS: 6  },
  sapphire: { label: "Sapphire",  neutralH: 213, neutralS: 22, accentH: 213, accentS: 58, highlightH: 33,  highlightS: 62, cautionH: 283, cautionS: 40 },
  emerald:  { label: "Emerald",   neutralH: 152, neutralS: 18, accentH: 152, accentS: 42, highlightH: 332, highlightS: 46, cautionH: 45,  cautionS: 55 },
  amethyst: { label: "Amethyst",  neutralH: 262, neutralS: 16, accentH: 262, accentS: 36, highlightH: 82,  highlightS: 38, cautionH: 350, cautionS: 48 },
  copper:   { label: "Copper",    neutralH: 23,  neutralS: 20, accentH: 23,  accentS: 62, highlightH: 203, highlightS: 54, cautionH: 140, cautionS: 35 },
  rose:     { label: "Rose",      neutralH: 340, neutralS: 16, accentH: 340, accentS: 48, highlightH: 160, highlightS: 42, cautionH: 48,  cautionS: 55 },
};

const TOKEN_META = [
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

function safeGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
function safeSet(key, val){ try { localStorage.setItem(key, val); } catch(e){} }

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

const themeState = { preset: "copper", mode: "dark", overrides: {} };

function loadTheme(){
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

function persistTheme(){ safeSet("resume-theme", JSON.stringify(themeState)); }

function systemPrefersDark(){
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function effectiveMode(){
  return themeState.mode === "auto" ? (systemPrefersDark() ? "dark" : "light") : themeState.mode;
}

function activeTokens(){
  return { ...computeTokens(PALETTES[themeState.preset], effectiveMode()), ...themeState.overrides };
}

function refreshTheme(){
  const tokens = activeTokens();
  TOKEN_META.forEach(m => document.documentElement.style.setProperty(m.cssVar, tokens[m.key]));
}

function buildThemePopup(){
  const pop = document.getElementById("theme-pop");
  const groups = ["Surfaces", "Text", "Accents"];
  let html = `<div><h4>Palette</h4><div class="preset-row" id="preset-row"></div></div>`;
  html += `<div><h4>Mode</h4><div class="mode-toggle" id="mode-toggle">
      <button type="button" data-mode="light">Light</button>
      <button type="button" data-mode="dark">Dark</button>
      <button type="button" data-mode="auto">Auto</button>
    </div></div>`;
  groups.forEach(g => {
    html += `<div class="token-group"><h4>${g}</h4>`;
    TOKEN_META.filter(m => m.group === g).forEach(m => {
      html += `<div class="token-row">
        <span class="t-label"><span class="t-name">${m.name}</span><span class="t-hint">${m.hint}</span></span>
        <input type="color" class="swatch-input" data-key="${m.key}">
      </div>`;
    });
    html += `</div>`;
  });
  html += `<div class="theme-pop-foot">
      <button type="button" class="link-btn" id="reset-theme-btn">Reset to preset</button>
      <span class="t-hint">Edits are remembered on this device</span>
    </div>`;
  pop.innerHTML = html;

  const presetRow = document.getElementById("preset-row");
  Object.entries(PALETTES).forEach(([key, p]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "preset-swatch";
    b.title = p.label;
    b.style.background = hslToHex(p.accentH, Math.max(p.accentS, 25), 48);
    b.dataset.preset = key;
    b.addEventListener("click", () => {
      themeState.preset = key;
      themeState.overrides = {};
      syncPopupUI(); refreshTheme(); persistTheme();
    });
    presetRow.appendChild(b);
  });

  pop.querySelectorAll("#mode-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      themeState.mode = btn.dataset.mode;
      syncPopupUI(); refreshTheme(); persistTheme();
    });
  });

  pop.querySelectorAll(".swatch-input").forEach(inp => {
    inp.addEventListener("input", () => {
      themeState.overrides[inp.dataset.key] = inp.value;
      refreshTheme(); persistTheme();
    });
  });

  document.getElementById("reset-theme-btn").addEventListener("click", () => {
    themeState.overrides = {};
    syncPopupUI(); refreshTheme(); persistTheme();
  });
}

function syncPopupUI(){
  document.querySelectorAll(".preset-swatch").forEach(b => b.classList.toggle("is-active", b.dataset.preset === themeState.preset));
  document.querySelectorAll("#mode-toggle button").forEach(b => b.classList.toggle("is-active", b.dataset.mode === themeState.mode));
  const tokens = activeTokens();
  document.querySelectorAll(".swatch-input").forEach(inp => { inp.value = tokens[inp.dataset.key]; });
}

export function initThemeUI(){
  loadTheme();
  buildThemePopup();
  syncPopupUI();
  refreshTheme();

  const btn = document.getElementById("theme-btn");
  const pop = document.getElementById("theme-pop");
  btn.addEventListener("click", () => {
    const willOpen = pop.hidden;
    pop.hidden = !willOpen;
    btn.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) syncPopupUI();
  });
  document.addEventListener("click", (e) => {
    if (!pop.hidden && !pop.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      pop.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
      if (themeState.mode === "auto") refreshTheme();
    });
  }
}
