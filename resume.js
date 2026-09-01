import { t } from "./i18n.js";
import { getConfig } from "./app.js";

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

function contact(){ return getConfig().contact || {}; }
function companyLI(){ return getConfig().companyLinkedIn || {}; }

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
      <div class="tech-tags">${stack.split(",").map(s => `<span class="tech-tag">${esc(s.trim())}</span>`).join("")}</div>
      <ul class="bullets">${bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>`;
}

function sortByLength(items){
  const sorted = [...items];
  sorted.sort((a, b) => b.length - a.length);
  const result = [];
  let lo = 0, hi = sorted.length - 1;
  let pickLong = true;
  while (lo <= hi) {
    result.push(pickLong ? sorted[lo++] : sorted[hi--]);
    pickLong = !pickLong;
  }
  return result;
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

export function render(){
  const cli = companyLI();
  const experienceHtml = [
    jobHtml(
      t("nortalTitle"), t("nortalCompany"), t("nortalDates"), t("nortalLocation"),
      "Java 17, Spring Boot 3.0, Spring Security, Kafka, Terraform, AWS, Docker, Kubernetes",
      [t("nortalBullet1"), t("nortalBullet2"), t("nortalBullet3"), t("nortalBullet4")],
      cli.nortal
    ),
    jobHtml(
      t("sistemasTitle"), t("sistemasCompany"), t("sistemasDates"), t("sistemasLocation"),
      "Java, JSP, Maven, SQL, Batch Processing",
      [t("sistemasBullet1"), t("sistemasBullet2"), t("sistemasBullet3")],
      cli.sistemas
    ),
    jobHtml(
      t("atrTitle"), t("atrCompany"), t("atrDates"), t("atrLocation"),
      "C++, Qt5, Java, JNI, Azure Pipelines, Linux",
      [t("atrBullet1"), t("atrBullet2"), t("atrBullet3")],
      cli.atr
    ),
    jobHtml(
      t("urbanissaTitle"), t("urbanissaCompany"), t("urbanissaDates"), t("urbanissaLocation"),
      "Flutter, .NET Core, Node.js / TypeScript, Angular, SQL",
      [t("urbanissaBullet1"), t("urbanissaBullet2")],
      cli.urbanissa
    ),
    jobHtml(
      t("jarabesoftTitle"), t("jarabesoftCompany"), t("jarabesoftDates"), t("jarabesoftLocation"),
      "C++, Qt5, Ionic, Loopback 3 (Node.js / Express), Google Cloud",
      [t("jarabesoftBullet1"), t("jarabesoftBullet2")],
      cli.jarabesoft
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
      <a class="contact-chip link c-li" href="${contact().linkedinUrl || "#"}" target="_blank" rel="noopener"><span class="ico">${ICONS.linkedin}</span>${esc(t("linkedinLabel"))}</a>
      <a class="contact-chip link c-gh" href="${contact().githubUrl || "#"}" target="_blank" rel="noopener"><span class="ico">${ICONS.github}</span>${esc(t("githubLabel"))}</a>
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
