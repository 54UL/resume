import { loadConfig } from "./domain/config.js";
import { loadLocales } from "./domain/i18n.js";
import { loadPalettes } from "./domain/theme-engine.js";
import { render } from "./ui/resume.js";
import { initLangControl, initFontControl, initDownload, updateUIStrings } from "./ui/toolbar.js";
import { initThemeUI } from "./ui/theme-popup.js";

async function init(){
  await Promise.all([loadConfig(), loadLocales(), loadPalettes()]);
  initLangControl();
  initFontControl();
  render();
  updateUIStrings();
  initThemeUI();
  initDownload();
}

init();
