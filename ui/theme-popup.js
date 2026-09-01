import {
  PALETTES, TOKEN_META, themeState,
  loadTheme, persistTheme, activeTokens, paletteSwatchColor
} from "../domain/theme-engine.js";

function applyTokensToDOM(){
  const tokens = activeTokens();
  TOKEN_META.forEach(m => document.documentElement.style.setProperty(m.cssVar, tokens[m.key]));
}

function syncPopupUI(){
  document.querySelectorAll(".preset-swatch").forEach(b =>
    b.classList.toggle("is-active", b.dataset.preset === themeState.preset)
  );
  document.querySelectorAll("#mode-toggle button").forEach(b =>
    b.classList.toggle("is-active", b.dataset.mode === themeState.mode)
  );
  const tokens = activeTokens();
  document.querySelectorAll(".swatch-input").forEach(inp => {
    inp.value = tokens[inp.dataset.key];
  });
}

function buildPopup(){
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
    b.style.background = paletteSwatchColor(p);
    b.dataset.preset = key;
    b.addEventListener("click", () => {
      themeState.preset = key;
      themeState.overrides = {};
      syncPopupUI(); applyTokensToDOM(); persistTheme();
    });
    presetRow.appendChild(b);
  });

  pop.querySelectorAll("#mode-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      themeState.mode = btn.dataset.mode;
      syncPopupUI(); applyTokensToDOM(); persistTheme();
    });
  });

  pop.querySelectorAll(".swatch-input").forEach(inp => {
    inp.addEventListener("input", () => {
      themeState.overrides[inp.dataset.key] = inp.value;
      applyTokensToDOM(); persistTheme();
    });
  });

  document.getElementById("reset-theme-btn").addEventListener("click", () => {
    themeState.overrides = {};
    syncPopupUI(); applyTokensToDOM(); persistTheme();
  });
}

export function initThemeUI(){
  loadTheme();
  buildPopup();
  syncPopupUI();
  applyTokensToDOM();

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
      if (themeState.mode === "auto") applyTokensToDOM();
    });
  }
}
