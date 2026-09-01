const locales = {};

function safeGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }

export let currentLang = safeGet("resume-lang") || "en-US";

export function setLang(lang){
  currentLang = lang;
}

export function t(key){
  return locales[currentLang]?.[key] || locales["en-US"]?.[key] || key;
}

export async function loadLocales(){
  const [enUS, esMX] = await Promise.all([
    fetch("./i18n/en-US.json").then(r => r.json()),
    fetch("./i18n/es-MX.json").then(r => r.json()),
  ]);
  locales["en-US"] = enUS;
  locales["es-MX"] = esMX;
}
