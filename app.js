import { loadLocales } from "./i18n.js";
import { initThemeUI } from "./theme.js";
import { render } from "./resume.js";
import { initLangControl, initFontControl, initDownload, updateUIStrings } from "./controls.js";

async function init(){
  await loadLocales();
  initLangControl();
  initFontControl();
  render();
  updateUIStrings();
  initThemeUI();
  initDownload();
}

init();
