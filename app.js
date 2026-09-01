/* =========================================================================
   THEME ENGINE
   ========================================================================= */
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

const PALETTES = {
  graphite: { label: "Graphite",  neutralH: 213, neutralS: 6,  accentH: 213, accentS: 6,  highlightH: 213, highlightS: 6,  cautionH: 213, cautionS: 6  },
  sapphire: { label: "Sapphire",  neutralH: 213, neutralS: 22, accentH: 213, accentS: 58, highlightH: 33,  highlightS: 62, cautionH: 283, cautionS: 40 },
  emerald:  { label: "Emerald",   neutralH: 152, neutralS: 18, accentH: 152, accentS: 42, highlightH: 332, highlightS: 46, cautionH: 45,  cautionS: 55 },
  amethyst: { label: "Amethyst",  neutralH: 262, neutralS: 16, accentH: 262, accentS: 36, highlightH: 82,  highlightS: 38, cautionH: 350, cautionS: 48 },
  copper:   { label: "Copper",    neutralH: 23,  neutralS: 20, accentH: 23,  accentS: 62, highlightH: 203, highlightS: 54, cautionH: 140, cautionS: 35 },
  rose:     { label: "Rose",      neutralH: 340, neutralS: 16, accentH: 340, accentS: 48, highlightH: 160, highlightS: 42, cautionH: 48,  cautionS: 55 },
};

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

const themeState = { preset: "graphite", mode: "auto", overrides: {} };

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

function initThemeUI(){
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

/* =========================================================================
   I18N
   ========================================================================= */
const I18N = {
  "en-US": {
    // Contact
    name: "Saul Aceves",
    location: "Guadalajara, Jalisco, Mexico",
    email: "54ulacvs@gmail.com",
    phone: "+52 33 1965 8586",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",

    // Header
    tagline: "Software Engineer",
    taglineAccent: "— Java \u00b7 .NET \u00b7 Node.js \u00b7 C++11 \u00b7 Cloud",
    statusPill: "Open to new roles",

    // Summary
    summary: "Backend engineer with 6+ years of experience, currently building Java 17 / Spring Boot 3.0 services for T-Mobile\u2019s e-commerce platform at Nortal \u2014 Kafka event pipelines, Spring Security, Terraform-provisioned AWS infrastructure, and Kubernetes in production. Background spans .NET Core, Node.js, and C++ across fintech, real estate, and embedded systems.",

    // Section labels
    sectionExperience: "Experience",
    sectionSkills: "Skills",
    sectionEducation: "Education & Languages",

    // Jobs
    nortalTitle: "Back End Developer",
    nortalCompany: "Nortal",
    nortalDates: "Sep 2024 \u2013 Present",
    nortalLocation: "Guadalajara, Mexico (Remote)",
    nortalBullet1: "Build backend services for T-Mobile\u2019s enterprise e-commerce platform (built on Elastic Path Commerce) in Java and Spring Boot, supporting transactions across every sales channel.",
    nortalBullet2: "Provision and manage AWS infrastructure with Terraform; deploy and operate containerized services on Kubernetes across staging and production.",
    nortalBullet3: "Extend Kafka-based event flows to keep order, inventory, and catalog state consistent across services; add retry and circuit-breaker patterns to protect checkout under peak load.",
    nortalBullet4: "Kept the platform fully stable through the iPhone 17 launch \u2014 tens of thousands of units sold in the first 15 minutes, zero critical failures.",

    sistemasTitle: "Program Analyst",
    sistemasCompany: "Internacional de Sistemas de Imagen",
    sistemasDates: "Apr 2023 \u2013 Sep 2024",
    sistemasLocation: "Guadalajara, Mexico",
    sistemasBullet1: "Built and maintained batch-processing pipelines for loan-management services, handling high-volume financial data under strict accuracy and compliance requirements.",
    sistemasBullet2: "Extended legacy Java/JSP backend systems on Maven, cutting processing time for critical lending workflows.",
    sistemasBullet3: "Served major financial institutions including Banorte, Fin Com\u00fan, and Dimex; the platform handles \u223c26% of all loan origination in Mexico, supporting personal, payroll, auto, mortgage, group, and commercial loan products.",

    atrTitle: "Full-Stack Developer",
    atrCompany: "ATR \u2014 Advanced Technology Research",
    atrDates: "Dec 2021 \u2013 Mar 2023",
    atrLocation: "Guadalajara, Mexico",
    atrBullet1: "Led development of a next-generation jukebox platform on Linux in C++/Qt5, with DRM, custom media encryption, and cloud-synced catalogs.",
    atrBullet2: "Architected a shared core codebase reused across three products \u2014 Arion Jukebox, Zuni Digital Signage, and D\u2019Jam mobile \u2014 cutting duplicate work across teams.",
    atrBullet3: "Ran build and release automation through Azure Pipelines across all product lines.",

    urbanissaTitle: "Full-Stack Developer",
    urbanissaCompany: "Urbanissa",
    urbanissaDates: "Jun 2021 \u2013 Dec 2021",
    urbanissaLocation: "Guadalajara, Mexico",
    urbanissaBullet1: "Built infrastructure microservices (notifications, SMS, user management) in .NET Core and Node.js/TypeScript behind an ERP for real-estate operations.",
    urbanissaBullet2: "Built web and mobile clients in Flutter and Angular consuming those services; created a shared JS framework adopted across the platform.",

    jarabesoftTitle: "Full-Stack Developer",
    jarabesoftCompany: "JarabeSoft",
    jarabesoftDates: "Apr 2019 \u2013 Jun 2021",
    jarabesoftLocation: "Guadalajara, Mexico",
    jarabesoftBullet1: "Re-implemented Bire\u2019s jukebox software on Linux in C++/Qt5.",
    jarabesoftBullet2: "Built internal web and mobile tools on the MEAN stack and Ionic, with Loopback 3 REST APIs on Node.js.",

    // Skills
    skillLang: "Languages, Frameworks & Tooling",
    skillCloud: "Cloud & Infrastructure",
    skillData: "Data & Messaging",
    skillOther: "Other",
    skillERP: "ERP Development",
    skillQuality: "Testing & Code Quality",
    qualityStatic: "Static Analysis",
    qualityUnit: "Unit Testing",
    qualityIntegration: "Integration Testing",
    skillAI: "AI / LLM Engineering",
    aiSkill1: "Agentic AI systems",
    aiSkill2: "LLM application development",
    aiSkill3: "Self-hosted LLMs",
    aiSkill4: "Prompt engineering",
    aiSkill5: "Chatbot development",

    // Education
    degree: "Software Development Technologist",
    school: "Centro de Ense\u00f1anza T\u00e9cnica Industrial (CETI)",
    eduDates: "2015 \u2013 2019",
    eduLocation: "Guadalajara, Mexico",
    langSpanish: "Spanish",
    langSpanishLevel: "Native",
    langEnglish: "English",
    langEnglishLevel: "Advanced (professional working proficiency)",

    // Toolbar / UI
    toolbarDownload: "Download PDF",
    toolbarDownloading: "Preparing\u2026",
    toolbarThemeTitle: "Customize theme",
    toolbarLangLabel: "Language",
    toolbarFontLabel: "Font",
    credit: "Theme and language choices are remembered on this device only.",
  },

  "es-MX": {
    // Contacto
    name: "Saul Aceves",
    location: "Guadalajara, Jalisco, M\u00e9xico",
    email: "54ulacvs@gmail.com",
    phone: "+52 33 1965 8586",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",

    // Encabezado
    tagline: "Ingeniero de Software",
    taglineAccent: "— Java \u00b7 Spring Boot \u00b7 .NET \u00b7 Node.js \u00b7 Nube",
    statusPill: "Abierto a nuevas oportunidades",

    // Resumen
    summary: "Ingeniero backend con m\u00e1s de 6 a\u00f1os de experiencia, actualmente desarrollando servicios en Java 17 / Spring Boot 3.0 para la plataforma de e-commerce de T-Mobile en Nortal \u2014 pipelines de eventos con Kafka, Spring Security, infraestructura AWS con Terraform y Kubernetes en producci\u00f3n. Experiencia previa en .NET Core, Node.js y C++ en fintech, bienes ra\u00edces y sistemas embebidos.",

    // Etiquetas de secci\u00f3n
    sectionExperience: "Experiencia",
    sectionSkills: "Habilidades",
    sectionEducation: "Educaci\u00f3n e Idiomas",

    // Empleos
    nortalTitle: "Desarrollador Back End",
    nortalCompany: "Nortal",
    nortalDates: "Sep 2024 \u2013 Presente",
    nortalLocation: "Guadalajara, M\u00e9xico (Remoto)",
    nortalBullet1: "Desarrollo de servicios backend para la plataforma de comercio electr\u00f3nico empresarial de T-Mobile (construida sobre Elastic Path Commerce) en Java y Spring Boot, soportando transacciones en todos los canales de venta.",
    nortalBullet2: "Aprovisionamiento y gesti\u00f3n de infraestructura AWS con Terraform; despliegue y operaci\u00f3n de servicios contenerizados en Kubernetes en ambientes de staging y producci\u00f3n.",
    nortalBullet3: "Extensi\u00f3n de flujos de eventos basados en Kafka para mantener la consistencia de pedidos, inventario y cat\u00e1logo entre servicios; implementaci\u00f3n de patrones de reintento y circuit-breaker para proteger el checkout bajo carga alta.",
    nortalBullet4: "Mantuve la plataforma completamente estable durante el lanzamiento del iPhone 17 \u2014 decenas de miles de unidades vendidas en los primeros 15 minutos, cero fallas cr\u00edticas.",

    sistemasTitle: "Analista de Programas",
    sistemasCompany: "Internacional de Sistemas de Imagen",
    sistemasDates: "Abr 2023 \u2013 Sep 2024",
    sistemasLocation: "Guadalajara, M\u00e9xico",
    sistemasBullet1: "Construcci\u00f3n y mantenimiento de pipelines de procesamiento por lotes para servicios de gesti\u00f3n de pr\u00e9stamos, manejando datos financieros de alto volumen bajo estrictos requisitos de precisi\u00f3n y cumplimiento normativo.",
    sistemasBullet2: "Extensi\u00f3n de sistemas backend legados en Java/JSP sobre Maven, reduciendo el tiempo de procesamiento en flujos cr\u00edticos de cr\u00e9dito.",
    sistemasBullet3: "Atend\u00ed instituciones financieras importantes como Banorte, Fin Com\u00fan y Dimex; la plataforma gestiona \u223c26% de toda la originaci\u00f3n de cr\u00e9ditos en M\u00e9xico, soportando pr\u00e9stamos personales, de n\u00f3mina, automotrices, hipotecarios, grupales y comerciales.",

    atrTitle: "Desarrollador Full-Stack",
    atrCompany: "ATR \u2014 Advanced Technology Research",
    atrDates: "Dic 2021 \u2013 Mar 2023",
    atrLocation: "Guadalajara, M\u00e9xico",
    atrBullet1: "Lider\u00e9 el desarrollo de una plataforma de rockola de nueva generaci\u00f3n en Linux con C++/Qt5, incluyendo DRM, cifrado de medios personalizado y cat\u00e1logos sincronizados en la nube.",
    atrBullet2: "Dise\u00f1\u00e9 un c\u00f3digo base compartido reutilizado en tres productos \u2014 Arion Jukebox, Zuni Digital Signage y D\u2019Jam mobile \u2014 reduciendo trabajo duplicado entre equipos.",
    atrBullet3: "Administr\u00e9 la automatizaci\u00f3n de compilaci\u00f3n y lanzamiento a trav\u00e9s de Azure Pipelines en todas las l\u00edneas de producto.",

    urbanissaTitle: "Desarrollador Full-Stack",
    urbanissaCompany: "Urbanissa",
    urbanissaDates: "Jun 2021 \u2013 Dic 2021",
    urbanissaLocation: "Guadalajara, M\u00e9xico",
    urbanissaBullet1: "Construcci\u00f3n de microservicios de infraestructura (notificaciones, SMS, gesti\u00f3n de usuarios) en .NET Core y Node.js/TypeScript detr\u00e1s de un ERP para operaciones inmobiliarias.",
    urbanissaBullet2: "Desarrollo de clientes web y m\u00f3viles en Flutter y Angular consumiendo esos servicios; creaci\u00f3n de un framework JS compartido adoptado en toda la plataforma.",

    jarabesoftTitle: "Desarrollador Full-Stack",
    jarabesoftCompany: "JarabeSoft",
    jarabesoftDates: "Abr 2019 \u2013 Jun 2021",
    jarabesoftLocation: "Guadalajara, M\u00e9xico",
    jarabesoftBullet1: "Reimplementaci\u00f3n del software de rockola de Bire en Linux con C++/Qt5.",
    jarabesoftBullet2: "Construcci\u00f3n de herramientas web y m\u00f3viles internas con el stack MEAN e Ionic, con APIs REST de Loopback 3 en Node.js.",

    // Habilidades
    skillLang: "Lenguajes, Frameworks y Herramientas",
    skillCloud: "Nube e Infraestructura",
    skillData: "Datos y Mensajer\u00eda",
    skillOther: "Otros",
    skillERP: "Desarrollo de ERP",
    skillQuality: "Testing y Calidad de C\u00f3digo",
    qualityStatic: "An\u00e1lisis Est\u00e1tico",
    qualityUnit: "Pruebas Unitarias",
    qualityIntegration: "Pruebas de Integraci\u00f3n",
    skillAI: "Ingenier\u00eda de IA / LLM",
    aiSkill1: "Sistemas de IA ag\u00e9ntica",
    aiSkill2: "Desarrollo de aplicaciones con LLM",
    aiSkill3: "LLMs locales",
    aiSkill5: "Desarrollo de chatbots",

    // Educaci\u00f3n
    degree: "Tecn\u00f3logo en Desarrollo de Software",
    school: "Centro de Ense\u00f1anza T\u00e9cnica Industrial (CETI)",
    eduDates: "2015 \u2013 2019",
    eduLocation: "Guadalajara, M\u00e9xico",
    langSpanish: "Espa\u00f1ol",
    langSpanishLevel: "Nativo",
    langEnglish: "Ingl\u00e9s",
    langEnglishLevel: "Avanzado (competencia profesional)",

    // Barra / UI
    toolbarDownload: "Descargar PDF",
    toolbarDownloading: "Preparando\u2026",
    toolbarThemeTitle: "Personalizar tema",
    toolbarLangLabel: "Idioma",
    credit: "Las preferencias de tema e idioma se guardan solo en este dispositivo.",
  },
};

let currentLang = safeGet("resume-lang") || "en-US";
function t(key){ return I18N[currentLang][key] || I18N["en-US"][key] || key; }

/* =========================================================================
   ICONS
   ========================================================================= */
const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2a3.5 3.5 0 0 0-3.47 3.05A3.5 3.5 0 0 0 4 8.5c0 .53.11 1.03.31 1.49A3.5 3.5 0 0 0 6 16.4V19a3 3 0 0 0 3 3h.5a2 2 0 0 0 2-2V5a3 3 0 0 0-2-3z"/><path d="M14.5 2a3.5 3.5 0 0 1 3.47 3.05A3.5 3.5 0 0 1 20 8.5c0 .53-.11 1.03-.31 1.49A3.5 3.5 0 0 1 18 16.4V19a3 3 0 0 1-3 3h-.5a2 2 0 0 1-2-2V5a3 3 0 0 1 2-3z"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.3-1.6A4.5 4.5 0 0 0 6.5 19h11z"/></svg>',
  data: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 1 1 5.4-5.4z"/></svg>',
};

/* =========================================================================
   RESUME DATA (unified — no variants)
   ========================================================================= */
const CONTACT = {
  linkedinUrl: "https://linkedin.com/in/saul-aceves-89a988b3",
  githubUrl: "https://github.com/54UL",
};

/* =========================================================================
   RENDER
   ========================================================================= */
function esc(s){
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function jobHtml(title, company, dates, location, stack, bullets, linkedinUrl){
  const companyHtml = linkedinUrl
    ? `<a class="company-link accent" href="${linkedinUrl}" target="_blank" rel="noopener">${esc(company)}<span class="company-li">${ICONS.linkedin}</span></a>`
    : `<span class="accent">${esc(company)}</span>`;
  return `
    <div class="job">
      <div class="job-top">
        <span class="job-title">${esc(title)}</span>
        <span class="job-dates">${esc(dates)}</span>
      </div>
      <div class="job-sub">
        ${companyHtml}
        <span class="job-loc">${esc(location)}</span>
      </div>
      <div class="tech-tags">${stack.split(",").map(t => `<span class="tech-tag">${esc(t.trim())}</span>`).join("")}</div>
      <ul class="bullets">${bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>`;
}

function sortByLength(items){
  const sorted = [...items];
  sorted.sort((a, b) => b.length - a.length);
  // interleave: pick from front (long) and back (short) alternately to pack rows
  const result = [];
  let lo = 0, hi = sorted.length - 1;
  let pickLong = true;
  while (lo <= hi) {
    result.push(pickLong ? sorted[lo++] : sorted[hi--]);
    pickLong = !pickLong;
  }
  return result;
}

function skillCardHtml(icon, title, items){
  const packed = sortByLength(items);
  return `
    <div class="skill-card">
      <h3>${ICONS[icon] || ""}${esc(title)}</h3>
      <div class="skill-pills">${packed.map(i => `<span class="skill-pill">${esc(i)}</span>`).join("")}</div>
    </div>`;
}

function groupedCardHtml(icon, title, groups){
  let inner = groups.map(g => {
    const packed = sortByLength(g.items);
    return `
    <div class="grouped-subcard">
      <h4 class="subcard-label">${esc(g.label)}</h4>
      <div class="skill-pills">${packed.map(i => `<span class="skill-pill">${esc(i)}</span>`).join("")}</div>
    </div>`;
  }).join("");
  return `
    <div class="skill-card grouped-card">
      <h3>${ICONS[icon] || ""}${esc(title)}</h3>
      <div class="grouped-grid">${inner}</div>
    </div>`;
}

function render(){
  const experienceHtml = [
    jobHtml(
      t("nortalTitle"), t("nortalCompany"), t("nortalDates"), t("nortalLocation"),
      "Java 17, Spring Boot 3.0, Spring Security, Kafka, Terraform, AWS, Docker, Kubernetes",
      [t("nortalBullet1"), t("nortalBullet2"), t("nortalBullet3"), t("nortalBullet4")],
      "https://www.linkedin.com/company/nortal/"
    ),
    jobHtml(
      t("sistemasTitle"), t("sistemasCompany"), t("sistemasDates"), t("sistemasLocation"),
      "Java, JSP, Maven, SQL, Batch Processing",
      [t("sistemasBullet1"), t("sistemasBullet2"), t("sistemasBullet3")],
      "https://www.linkedin.com/company/internacional-de-sistemas-de-imagen/"
    ),
    jobHtml(
      t("atrTitle"), t("atrCompany"), t("atrDates"), t("atrLocation"),
      "C++, Qt5, Java, JNI, Azure Pipelines, Linux",
      [t("atrBullet1"), t("atrBullet2"), t("atrBullet3")],
      "https://www.linkedin.com/company/aaboron/"
    ),
    jobHtml(
      t("urbanissaTitle"), t("urbanissaCompany"), t("urbanissaDates"), t("urbanissaLocation"),
      "Flutter, .NET Core, Node.js / TypeScript, Angular, SQL",
      [t("urbanissaBullet1"), t("urbanissaBullet2")],
      "https://www.linkedin.com/company/urbanissa/"
    ),
    jobHtml(
      t("jarabesoftTitle"), t("jarabesoftCompany"), t("jarabesoftDates"), t("jarabesoftLocation"),
      "C++, Qt5, Ionic, Loopback 3 (Node.js / Express), Google Cloud",
      [t("jarabesoftBullet1"), t("jarabesoftBullet2")],
      "https://www.linkedin.com/company/jarabe-soft/"
    ),
  ].join("");

  const skillsHtml = [
    groupedCardHtml("code", t("skillLang"), [
      { label: "Java", items: ["Java (8\u201321)", "Spring Boot", "Spring Security", "Spring Cloud Config", "Spring Batch", "Spring Data", "Maven", "Gradle"] },
      { label: ".NET / C#", items: ["C#", ".NET Framework", ".NET Core (1.0\u20136.0)", "Entity Framework", "SignalR", "UWP", "Cake"] },
      { label: "JavaScript / TypeScript", items: ["Node.js", "TypeScript", "Loopback", "Electron"] },
      { label: "Front End", items: ["Angular", "Ionic", "HTML", "CSS", "SCSS"] },
      { label: "C / C++", items: ["C / C++", "Qt5 / Qt6", "QML", "CMake / Make", "QMake"] },
      { label: "Mobile", items: ["Flutter", "Dart", "Xamarin", "Android (Java / Kotlin / JNI)"] },
      { label: "Databases", items: ["PostgreSQL", "Oracle SQL", "MongoDB"] },
      { label: "Linux Distros", items: ["Ubuntu", "Manjaro", "Debian", "RHEL"] },
      { label: "General", items: ["Linux", "Git"] },
    ]),
    groupedCardHtml("cloud", t("skillCloud"), [
      { label: "AWS", items: ["Lambda", "DynamoDB", "S3", "EC2", "IAM", "CloudWatch"] },
      { label: "Google Cloud", items: ["Cloud Functions", "Firestore", "Cloud Storage", "Compute Engine"] },
      { label: "Azure", items: ["Functions", "Cosmos DB", "Blob Storage", "App Service", "DevOps"] },
      { label: "General", items: ["Terraform", "Docker", "Kubernetes"] },
    ]),
    groupedCardHtml("tool", t("skillQuality"), [
        { label: t("qualityStatic"), items: ["SonarQube", "Checkstyle", "PMD", "ESLint", "TSLint", "Clang-Tidy", "Cppcheck", "Dart Analyzer"] },
        { label: t("qualityUnit"), items: ["JUnit 4 / 5", "Mockito", "TestNG", "xUnit", "NUnit", "Jest", "Mocha", "Google Test"] },
        { label: t("qualityIntegration"), items: ["Cucumber / Gherkin", "Selenium", "REST Assured", "Testcontainers", "Cypress", "Karate", "Postman / Newman"] },
    ]),
    groupedCardHtml("code", t("skillOther"), [
      { label: t("skillData"), items: ["Apache Kafka", "Apache ActiveMQ", "REST APIs"] },
      { label: t("skillERP"), items: ["Epicor", "Odoo"] },
      { label: t("skillAI"), items: [t("aiSkill1"), t("aiSkill2"), t("aiSkill3"), t("aiSkill5")] },
    ]),
  ].join("");

  const langHtml = `
    <div>${esc(t("langSpanish"))} <span class="muted">\u2014 ${esc(t("langSpanishLevel"))}</span></div>
    <div>${esc(t("langEnglish"))} <span class="muted">\u2014 ${esc(t("langEnglishLevel"))}</span></div>`;

  document.getElementById("resume-sheet").innerHTML = `
    <header class="hero">
      <div class="name-block">
        <h1 class="name">${esc(t("name"))}</h1>
        <p class="tagline">${esc(t("tagline"))} <span class="accent">${esc(t("taglineAccent"))}</span></p>
      </div>
      <span class="status-pill"><span class="dot"></span>${esc(t("statusPill"))}</span>
    </header>
    <div class="contact-row">
      <span class="contact-chip c-pin"><span class="ico">${ICONS.pin}</span>${esc(t("location"))}</span>
      <a class="contact-chip link c-li" href="${CONTACT.linkedinUrl}" target="_blank" rel="noopener"><span class="ico">${ICONS.linkedin}</span>${esc(t("linkedinLabel"))}</a>
      <a class="contact-chip link c-gh" href="${CONTACT.githubUrl}" target="_blank" rel="noopener"><span class="ico">${ICONS.github}</span>${esc(t("githubLabel"))}</a>
    </div>
    <hr class="rule">
    <p class="summary">${esc(t("summary"))}</p>

    <section>
      <div class="section-label">${esc(t("sectionExperience"))}</div>
      <div class="job-list">${experienceHtml}</div>
    </section>

    <section>
      <div class="section-label">${esc(t("sectionSkills"))}</div>
      <div class="skills-flex">${skillsHtml}</div>
    </section>

    <section>
      <div class="section-label">${esc(t("sectionEducation"))}</div>
      <div class="footer-flex">
        <div>
          <b>${esc(t("degree"))}</b>
          <span class="muted">${esc(t("school"))} \u00b7 ${esc(t("eduDates"))} \u00b7 ${esc(t("eduLocation"))}</span>
        </div>
        <div>${langHtml}</div>
      </div>
    </section>
  `;
}

/* =========================================================================
   CONTROLS
   ========================================================================= */
function initLangControl(){
  const select = document.getElementById("lang-select");
  select.value = currentLang;
  select.addEventListener("change", () => {
    currentLang = select.value;
    safeSet("resume-lang", currentLang);
    document.documentElement.lang = currentLang.split("-")[0];
    render();
    updateUIStrings();
  });
}

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

let currentFont = safeGet("resume-font") || "source-sans";

function applyFont(key){
  const ft = FONT_THEMES[key] || FONT_THEMES["source-sans"];
  document.documentElement.style.setProperty("--font-body", ft.body);
  document.documentElement.style.setProperty("--font-heading", ft.heading);
}

function initFontControl(){
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

function updateUIStrings(){
  document.getElementById("download-btn-label").textContent = t("toolbarDownload");
  document.getElementById("credit-text").textContent = t("credit");
  document.getElementById("lang-label").textContent = t("toolbarLangLabel");
  document.getElementById("font-label").textContent = t("toolbarFontLabel");
}

function downloadPdf(){
  window.print();
}

function init(){
  initLangControl();
  initFontControl();
  render();
  updateUIStrings();
  initThemeUI();
  document.getElementById("download-btn").addEventListener("click", downloadPdf);
}

init();
