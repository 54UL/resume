import { t, currentLang, setLang } from "./i18n.js";
import { render } from "./resume.js";

function safeGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
function safeSet(key, val){ try { localStorage.setItem(key, val); } catch(e){} }

const FONT_THEMES = {
  "source-sans":    { label: "Source Sans",    body: '"Source Sans 3", ui-sans-serif, Arial, sans-serif',    heading: '"Libre Franklin", sans-serif' },
  "inter":          { label: "Inter",          body: '"Inter", ui-sans-serif, Arial, sans-serif',           heading: '"Inter", sans-serif' },
  "nunito":         { label: "Nunito",         body: '"Nunito", ui-sans-serif, Arial, sans-serif',          heading: '"Nunito", sans-serif' },
  "roboto":         { label: "Roboto",         body: '"Roboto", ui-sans-serif, Arial, sans-serif',         heading: '"Roboto", sans-serif' },
  "open-sans":      { label: "Open Sans",      body: '"Open Sans", ui-sans-serif, Arial, sans-serif',      heading: '"Open Sans", sans-serif' },
  "lato":           { label: "Lato",           body: '"Lato", ui-sans-serif, Arial, sans-serif',           heading: '"Lato", sans-serif' },
  "helvetica":      { label: "Helvetica Neue", body: '"Helvetica Neue", Helvetica, Arial, sans-serif',     heading: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  "ubuntu":         { label: "Ubuntu",         body: '"Ubuntu", ui-sans-serif, Arial, sans-serif',         heading: '"Ubuntu", sans-serif' },
};

let currentFont = safeGet("resume-font") || "ubuntu";

function applyFont(key){
  const ft = FONT_THEMES[key] || FONT_THEMES["source-sans"];
  document.documentElement.style.setProperty("--font-body", ft.body);
  document.documentElement.style.setProperty("--font-heading", ft.heading);
}

function updateUIStrings(){
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
  Object.entries(FONT_THEMES).forEach(([key, ft]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = ft.label;
    opt.style.fontFamily = ft.body;
    select.appendChild(opt);
  });
  select.value = currentFont;
  applyFont(currentFont);
  select.addEventListener("change", () => {
    currentFont = select.value;
    safeSet("resume-font", currentFont);
    applyFont(currentFont);
  });
}

export function initDownload(){
  document.getElementById("download-btn").addEventListener("click", () => window.print());
}

export { updateUIStrings };
