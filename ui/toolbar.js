import { t, currentLang, setLang } from "../domain/i18n.js";
import { safeSet } from "../domain/storage.js";
import { FONT_THEMES, FONT_CATEGORIES, getCurrentFont, setFont, applyFont } from "../domain/font-engine.js";
import { render } from "./resume.js";

export function updateUIStrings(){
  document.getElementById("download-btn-label").textContent = t("toolbarDownload");
  document.getElementById("credit-text").textContent = t("credit");
  document.getElementById("lang-label").textContent = t("toolbarLangLabel");
  document.getElementById("font-label").textContent = t("toolbarFontLabel");
}

export function initLangControl(){
  const select = document.getElementById("lang-select");
  select.value = currentLang;
  select.addEventListener("change", () => {
    setLang(select.value);
    safeSet("resume-lang", select.value);
    document.documentElement.lang = select.value.split("-")[0];
    render();
    updateUIStrings();
  });
}

export function initFontControl(){
  const select = document.getElementById("font-select");
  const entries = Object.entries(FONT_THEMES);
  FONT_CATEGORIES.forEach(cat => {
    const group = document.createElement("optgroup");
    group.label = cat;
    entries.filter(([, ft]) => ft.category === cat).forEach(([key, ft]) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = ft.label;
      opt.style.fontFamily = ft.body;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });
  const current = getCurrentFont();
  select.value = current;
  applyFont(current);
  select.addEventListener("change", () => {
    setFont(select.value);
    applyFont(select.value);
  });
}

export function initDownload(){
  document.getElementById("download-btn").addEventListener("click", () => window.print());
}
