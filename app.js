import { loadLocales } from "./i18n.js";
import { initThemeUI } from "./theme.js";
import { render } from "./resume.js";
import { initLangControl, initFontControl, initDownload, updateUIStrings } from "./controls.js";

let config = {};

export function getConfig(){ return config; }

function applyMeta(){
  const base = config.siteUrl || "";
  const og = config.og || {};
  const tw = config.twitter || {};
  const meta = config.meta || {};

  const imageUrl = og.image?.startsWith("http") ? og.image : base + (og.image || "");

  document.title = meta.title || document.title;

  const metaMap = {
    "description":          meta.description,
    "author":               meta.author,
  };
  const ogMap = {
    "og:type":              og.type,
    "og:title":             og.title,
    "og:description":       og.description,
    "og:image":             imageUrl,
    "og:image:width":       og.imageWidth,
    "og:image:height":      og.imageHeight,
    "og:locale":            og.locale,
    "og:locale:alternate":  og.localeAlternate,
    "og:url":               base,
  };
  const twMap = {
    "twitter:card":         tw.card,
    "twitter:title":        tw.title,
    "twitter:description":  tw.description,
    "twitter:image":        imageUrl,
  };

  for (const [name, content] of Object.entries(metaMap)) {
    if (!content) continue;
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute("content", content);
  }
  for (const [prop, content] of Object.entries(ogMap)) {
    if (content == null) continue;
    const el = document.querySelector(`meta[property="${prop}"]`);
    if (el) el.setAttribute("content", String(content));
  }
  for (const [name, content] of Object.entries(twMap)) {
    if (!content) continue;
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute("content", content);
  }
}

async function init(){
  config = await fetch("./config.json").then(r => r.json());
  await loadLocales();
  applyMeta();
  initLangControl();
  initFontControl();
  render();
  updateUIStrings();
  initThemeUI();
  initDownload();
}

init();
