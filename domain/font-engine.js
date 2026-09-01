import { safeGet, safeSet } from "./storage.js";

export const FONT_THEMES = {
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

export function getCurrentFont(){ return currentFont; }

export function setFont(key){
  currentFont = key;
  safeSet("resume-font", key);
}

export function applyFont(key){
  const ft = FONT_THEMES[key] || FONT_THEMES["source-sans"];
  document.documentElement.style.setProperty("--font-body", ft.body);
  document.documentElement.style.setProperty("--font-heading", ft.heading);
}
