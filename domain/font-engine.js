import { safeGet, safeSet } from "./storage.js";

export const FONT_CATEGORIES = [
  "Sans-serif",
  "Serif",
  "Monospaced",
];

export const FONT_THEMES = {
  // — Sans-serif —
  "source-sans":    { label: "Source Sans",       category: "Sans-serif", body: '"Source Sans 3", ui-sans-serif, Arial, sans-serif',         heading: '"Libre Franklin", sans-serif' },
  "inter":          { label: "Inter",             category: "Sans-serif", body: '"Inter", ui-sans-serif, Arial, sans-serif',                heading: '"Inter", sans-serif' },
  "nunito":         { label: "Nunito",            category: "Sans-serif", body: '"Nunito", ui-sans-serif, Arial, sans-serif',               heading: '"Nunito", sans-serif' },
  "roboto":         { label: "Roboto",            category: "Sans-serif", body: '"Roboto", ui-sans-serif, Arial, sans-serif',               heading: '"Roboto", sans-serif' },
  "open-sans":      { label: "Open Sans",         category: "Sans-serif", body: '"Open Sans", ui-sans-serif, Arial, sans-serif',            heading: '"Open Sans", sans-serif' },
  "lato":           { label: "Lato",              category: "Sans-serif", body: '"Lato", ui-sans-serif, Arial, sans-serif',                 heading: '"Lato", sans-serif' },
  "ubuntu":         { label: "Ubuntu",            category: "Sans-serif", body: '"Ubuntu", ui-sans-serif, Arial, sans-serif',               heading: '"Ubuntu", sans-serif' },
  "noto-sans":      { label: "Noto Sans",         category: "Sans-serif", body: '"Noto Sans", ui-sans-serif, Arial, sans-serif',            heading: '"Noto Sans", sans-serif' },
  "pt-sans":        { label: "PT Sans",           category: "Sans-serif", body: '"PT Sans", ui-sans-serif, Arial, sans-serif',              heading: '"PT Sans", sans-serif' },
  "arial":          { label: "Arial",             category: "Sans-serif", body: 'Arial, Helvetica, sans-serif',                             heading: 'Arial, Helvetica, sans-serif' },
  "helvetica":      { label: "Helvetica Neue",    category: "Sans-serif", body: '"Helvetica Neue", Helvetica, Arial, sans-serif',           heading: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  "verdana":        { label: "Verdana",           category: "Sans-serif", body: 'Verdana, Geneva, sans-serif',                              heading: 'Verdana, Geneva, sans-serif' },
  "trebuchet":      { label: "Trebuchet MS",      category: "Sans-serif", body: '"Trebuchet MS", Helvetica, sans-serif',                    heading: '"Trebuchet MS", Helvetica, sans-serif' },

  // — Serif —
  "merriweather":   { label: "Merriweather",      category: "Serif",      body: '"Merriweather", Georgia, serif',                           heading: '"Merriweather", Georgia, serif' },
  "eb-garamond":    { label: "EB Garamond",       category: "Serif",      body: '"EB Garamond", Garamond, "Times New Roman", serif',        heading: '"EB Garamond", Garamond, serif' },
  "pt-serif":       { label: "PT Serif",          category: "Serif",      body: '"PT Serif", Georgia, serif',                               heading: '"PT Serif", Georgia, serif' },
  "noto-serif":     { label: "Noto Serif",        category: "Serif",      body: '"Noto Serif", Georgia, serif',                             heading: '"Noto Serif", Georgia, serif' },
  "georgia":        { label: "Georgia",           category: "Serif",      body: 'Georgia, "Times New Roman", serif',                        heading: 'Georgia, "Times New Roman", serif' },
  "times":          { label: "Times New Roman",   category: "Serif",      body: '"Times New Roman", Times, serif',                          heading: '"Times New Roman", Times, serif' },

  // — Monospaced —
  "jetbrains-mono": { label: "JetBrains Mono",    category: "Monospaced", body: '"JetBrains Mono", ui-monospace, monospace',                heading: '"JetBrains Mono", monospace' },
  "fira-code":      { label: "Fira Code",         category: "Monospaced", body: '"Fira Code", ui-monospace, monospace',                     heading: '"Fira Code", monospace' },
  "source-code":    { label: "Source Code Pro",    category: "Monospaced", body: '"Source Code Pro", ui-monospace, monospace',               heading: '"Source Code Pro", monospace' },
  "ibm-plex-mono":  { label: "IBM Plex Mono",     category: "Monospaced", body: '"IBM Plex Mono", ui-monospace, monospace',                 heading: '"IBM Plex Mono", monospace' },
  "inconsolata":    { label: "Inconsolata",        category: "Monospaced", body: '"Inconsolata", ui-monospace, monospace',                   heading: '"Inconsolata", monospace' },
  "roboto-mono":    { label: "Roboto Mono",        category: "Monospaced", body: '"Roboto Mono", ui-monospace, monospace',                   heading: '"Roboto Mono", monospace' },
  "ubuntu-mono":    { label: "Ubuntu Mono",        category: "Monospaced", body: '"Ubuntu Mono", ui-monospace, monospace',                   heading: '"Ubuntu Mono", monospace' },
  "space-mono":     { label: "Space Mono",         category: "Monospaced", body: '"Space Mono", ui-monospace, monospace',                    heading: '"Space Mono", monospace' },
  "courier-prime":  { label: "Courier Prime",      category: "Monospaced", body: '"Courier Prime", "Courier New", monospace',               heading: '"Courier Prime", monospace' },
  "anonymous-pro":  { label: "Anonymous Pro",      category: "Monospaced", body: '"Anonymous Pro", ui-monospace, monospace',                 heading: '"Anonymous Pro", monospace' },
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
