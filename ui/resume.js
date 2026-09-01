import { t } from "../domain/i18n.js";
import { getConfig } from "../domain/config.js";
import { ICONS } from "./icons.js";

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
  const cfg = getConfig();
  const contact = cfg.contact || {};
  const cli = cfg.companyLinkedIn || {};

  const experienceHtml = [
    jobHtml(
      t("nortalTitle"), t("nortalCompany"), t("nortalDates"), t("nortalLocation"),
      "Java 17, Spring Boot 3.0, Spring Security, Kafka, Redis, Kinesis, SQS, Terraform, AWS, Docker, Kubernetes",
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
      { label: "Databases", items: ["PostgreSQL", "Oracle SQL", "MongoDB", "Redis"] },
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
      <a class="contact-chip link c-li" href="${contact.linkedinUrl || "#"}" target="_blank" rel="noopener"><span class="ico">${ICONS.linkedin}</span>${esc(t("linkedinLabel"))}</a>
      <a class="contact-chip link c-gh" href="${contact.githubUrl || "#"}" target="_blank" rel="noopener"><span class="ico">${ICONS.github}</span>${esc(t("githubLabel"))}</a>
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
