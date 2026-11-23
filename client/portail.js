/* Brief piloté par les données : logique de la page de brief.
   Module ES sans dépendance. Les parties pures (textes, validation, rendu en chaînes HTML) sont exportées
   et testées sous Node. Les fonctions qui touchent au navigateur (applyBrand, stockage local, logoFallback)
   ne sont pas appelées à l'import. Les règles de nettoyage des réponses reproduisent celles de la base. */

/* ---------------- API ---------------- */
export const SUPABASE_URL = "https://xkanmjlpysxpohsuqvwg.supabase.co";
export const SUPABASE_ANON = "sb_publishable_lIZtV_WtN5NcGSb0dnfaiQ_AgKYBIVa";   // clé publique par nature

// Test local, inerte en production : l'API devient l'origine de la page seulement sur localhost/127.0.0.1 avec api=local.
export function apiBase(loc = globalThis.location) {
  try {
    if (loc && (loc.hostname === "localhost" || loc.hostname === "127.0.0.1") && /[?&]api=local(&|$)/.test(loc.search || "")) return loc.origin;
  } catch { /* ignore */ }
  return SUPABASE_URL;
}

// Jeton et langue de la page de brief : d'abord le hash (#s=<32 hex>&lang=en), sinon la requête (?s=…, ancien format).
export function readBriefParams(loc = globalThis.location) {
  const h = new URLSearchParams(String(loc.hash || "").replace(/^#/, "")), q = new URLSearchParams(loc.search || "");
  const raw = h.has("s") ? h.get("s") : q.get("s");
  const token = /^[0-9a-f]{32}$/.test((raw || "").trim()) ? raw.trim() : "";
  const l = h.get("lang") || q.get("lang");
  return { token, lang: l === "fr" || l === "en" ? l : "", fromQuery: !!token && !h.has("s") };
}

// « brief_required:diffusion » → { code: "brief_required", key: "diffusion" }
export function splitErr(message) {
  const m = String(message || "");
  const i = m.indexOf(":");
  return i < 0 ? { code: m, key: "" } : { code: m.slice(0, i), key: m.slice(i + 1) };
}

// Appel d'une RPC. Erreur métier → e.code (+ e.key) ; réseau coupé ou serveur en panne → e.offline.
export async function rpc(fn, args, { base = apiBase(), keepalive = false } = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  let r;
  try {
    r = await fetch(`${base}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON, "Content-Type": "application/json" },
      body: JSON.stringify(args || {}),
      signal: ctl.signal,
      keepalive,
    });
  } catch {
    const err = new Error("offline"); err.offline = true; err.code = "offline"; throw err;
  } finally { clearTimeout(timer); }
  const txt = await r.text();
  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch { /* corps non JSON */ }
  if (!r.ok) {
    const { code, key } = splitErr((data && data.message) || "http_" + r.status);
    const err = new Error(code); err.code = code; err.key = key; err.offline = r.status >= 500; throw err;
  }
  return data;
}

/* ---------------- textes ---------------- */
export const T = {
  fr: {
    "lang.other": "English",
    "req": "obligatoire",
    "retry": "Réessayer",
    "save.saved": "Enregistré",
    "save.saving": "Enregistrement…",
    "save.offline": "Hors ligne, vos réponses sont gardées sur cet appareil",
    "save.error": "Enregistrement impossible pour l'instant. Vos réponses sont gardées sur cet appareil.",
    "save.limit": "Nous réessayons dans une minute. Vos réponses sont gardées sur cet appareil.",
    "save.big": "Vos réponses sont trop longues pour être enregistrées. Raccourcissez un texte.",
    "brief.rate": "Trop de demandes pour l'instant. Réessayez dans quelques minutes.",
    "brief.title": "Brief",
    "brief.hello": "Bonjour {name}",
    "brief.shoot": "Tournage du {date}",
    "brief.formula": "Formule : {name}",
    "brief.intro": "Quelques questions pour guider le montage. Vos réponses sont enregistrées au fur et à mesure.",
    "brief.invalid": "Ce lien n'est plus valide. Contactez votre studio.",
    "brief.offline": "Impossible de charger la page. Vérifiez votre connexion.",
    "brief.progress": "{n} questions sur {total}",
    "brief.progressOne": "{n} question sur {total}",
    "brief.send": "Envoyer mon brief",
    "brief.sending": "Envoi…",
    "brief.sendHint": "Une fois envoyé, le brief ne se modifie plus.",
    "brief.thanks": "Merci, votre brief est bien envoyé",
    "brief.thanksText": "Nous nous occupons du reste. Voici le récapitulatif de vos réponses.",
    "brief.noQuestions": "Aucune question à remplir.",
    "err.required": "Cette question est obligatoire.",
    "err.option": "Choisissez parmi les réponses proposées.",
    "err.text": "Ce texte est trop long.",
    "err.time": "Format : 12:30 (minutes:secondes) ou 1:12:30 (heures:minutes:secondes).",
    "err.ranges": "Vérifiez les passages : un début et une fin, par exemple 12:30.",
    "err.reels": "Vérifiez vos reels : indiquez un début ou une note, par exemple 02:10.",
    "err.link": "Cette adresse n'est pas valide. Exemple : https://exemple.com",
    "err.links": "Une des adresses n'est pas valide. Exemple : https://exemple.com",
    "err.generic": "Cette réponse n'est pas valide.",
    "err.send.rate": "Trop de demandes. Patientez quelques minutes puis réessayez. Rien n'est perdu.",
    "err.send.offline": "Vous êtes hors ligne. Rien n'est perdu : réessayez quand la connexion revient.",
    "err.send.fail": "L'envoi n'a pas abouti. Rien n'est perdu : réessayez dans un instant.",
    "err.send.big": "Vos réponses sont trop longues. Raccourcissez-les un peu.",
    "q.addRange": "Ajouter un passage",
    "q.addLink": "Ajouter un lien",
    "q.remove": "Supprimer",
    "q.from": "Début",
    "q.to": "Fin",
    "q.note": "Note (facultatif)",
    "q.reel": "Reel {n}",
    "q.range": "Passage {n}",
    "q.link": "Lien {n}",
    "sum.empty": "Aucune réponse enregistrée.",
    "err.files": "Un des fichiers n'est pas valable. Retirez-le puis déposez-le à nouveau.",
    "files.pick": "Choisir un fichier",
    "files.drop": "Glissez vos fichiers ici",
    "files.limits": "Jusqu'à {n} fichiers, {size} maximum par fichier.",
    "files.limitsOne": "1 fichier, {size} maximum.",
    "files.list": "Fichiers déposés",
    "files.remove": "Retirer {name}",
    "files.removed": "{name} retiré",
    "files.sending": "Ajout de {name}…",
    "files.progress": "Ajout de {name}",
    "files.done": "{name} : ajouté",
    "files.full": "Nombre maximum de fichiers atteint ({n}).",
    "files.wait": "Un fichier est en cours d'ajout. Vous pourrez envoyer votre brief dès qu'il sera ajouté.",
    "files.err.big": "{name} : ce fichier est trop lourd ({size} maximum).",
    "files.err.type": "{name} : ce type de fichier n'est pas accepté. Formats acceptés : {formats}.",
    "files.err.empty": "{name} : ce fichier est vide.",
    "files.err.max": "{name} : le nombre maximum de fichiers est atteint ({n}).",
    "files.err.dup": "{name} : ce fichier est déjà dans la liste.",
    "files.err.net": "L'ajout du fichier n'a pas abouti. Vérifiez votre connexion puis réessayez.",
    "files.err.fail": "L'ajout du fichier n'a pas abouti. Réessayez dans un instant.",
    "files.err.pending": "Un fichier n'a pas pu être ajouté. Réessayez ou retirez-le avant d'envoyer votre brief.",
    "files.err.refused": "{name} : ce fichier n'a pas pu être enregistré. Déposez-le à nouveau.",
    "files.pickMany": "Choisir des fichiers",
    "files.cancel": "Annuler",
    "files.cancelAria": "Annuler l'ajout de {name}",
    "save.refused": "Un fichier n'a pas pu être enregistré",
  },
  en: {
    "lang.other": "Français",
    "req": "required",
    "retry": "Try again",
    "save.saved": "Saved",
    "save.saving": "Saving…",
    "save.offline": "Offline, your answers are kept on this device",
    "save.error": "Could not save right now. Your answers are kept on this device.",
    "save.limit": "We will try again in a minute. Your answers are kept on this device.",
    "save.big": "Your answers are too long to be saved. Please shorten a text.",
    "brief.rate": "Too many requests right now. Please try again in a few minutes.",
    "brief.title": "Brief",
    "brief.hello": "Hello {name}",
    "brief.shoot": "Shoot on {date}",
    "brief.formula": "Package: {name}",
    "brief.intro": "A few questions to guide the edit. Your answers are saved as you go.",
    "brief.invalid": "This link is no longer valid. Please contact your studio.",
    "brief.offline": "The page could not be loaded. Check your connection.",
    "brief.progress": "{n} of {total} questions",
    "brief.progressOne": "{n} of {total} questions",
    "brief.send": "Send my brief",
    "brief.sending": "Sending…",
    "brief.sendHint": "Once sent, the brief can no longer be changed.",
    "brief.thanks": "Thank you, your brief has been sent",
    "brief.thanksText": "We take it from here. Here is a summary of your answers.",
    "brief.noQuestions": "No questions to fill in.",
    "err.required": "This question is required.",
    "err.option": "Please choose from the options.",
    "err.text": "This text is too long.",
    "err.time": "Format: 12:30 (minutes:seconds) or 1:12:30 (hours:minutes:seconds).",
    "err.ranges": "Check the parts: a start and an end, for example 12:30.",
    "err.reels": "Check your reels: give a start or a note, for example 02:10.",
    "err.link": "This address is not valid. Example: https://example.com",
    "err.links": "One of the addresses is not valid. Example: https://example.com",
    "err.generic": "This answer is not valid.",
    "err.send.rate": "Too many requests. Wait a few minutes and try again. Nothing is lost.",
    "err.send.offline": "You are offline. Nothing is lost: try again when the connection is back.",
    "err.send.fail": "Sending did not go through. Nothing is lost: try again in a moment.",
    "err.send.big": "Your answers are too long. Please shorten them a little.",
    "q.addRange": "Add a part",
    "q.addLink": "Add a link",
    "q.remove": "Remove",
    "q.from": "Start",
    "q.to": "End",
    "q.note": "Note (optional)",
    "q.reel": "Reel {n}",
    "q.range": "Part {n}",
    "q.link": "Link {n}",
    "sum.empty": "No answer saved.",
    "err.files": "One of the files is not valid. Remove it and upload it again.",
    "files.pick": "Choose a file",
    "files.drop": "Drag and drop your files here",
    "files.limits": "Up to {n} files, {size} maximum per file.",
    "files.limitsOne": "1 file, {size} maximum.",
    "files.list": "Uploaded files",
    "files.remove": "Remove {name}",
    "files.removed": "{name} removed",
    "files.sending": "Adding {name}…",
    "files.progress": "Adding {name}",
    "files.done": "{name}: added",
    "files.full": "Maximum number of files reached ({n}).",
    "files.wait": "A file is being added. You will be able to send your brief as soon as it is added.",
    "files.err.big": "{name}: this file is too large ({size} maximum).",
    "files.err.type": "{name}: this file type is not accepted. Accepted formats: {formats}.",
    "files.err.empty": "{name}: this file is empty.",
    "files.err.max": "{name}: the maximum number of files is reached ({n}).",
    "files.err.dup": "{name}: this file is already in the list.",
    "files.err.net": "The file could not be added. Check your connection and try again.",
    "files.err.fail": "The file could not be added. Please try again in a moment.",
    "files.err.pending": "A file could not be added. Try again or remove it before sending your brief.",
    "files.err.refused": "{name}: this file could not be saved. Please upload it again.",
    "files.pickMany": "Choose files",
    "files.cancel": "Cancel",
    "files.cancelAria": "Cancel adding {name}",
    "save.refused": "A file could not be saved",
  },
};

export function t(lang, key, vars) {
  const dict = T[lang] || T.fr;
  let s = dict[key] ?? T.fr[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return s;
}

/* ---------------- sécurité d'affichage ---------------- */
export function esc(v) {
  return String(v ?? "").replace(/[&<>"'`]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[c]));
}

// Texte venu de la base : { fr, en } ou texte simple.
export function loc(v, lang) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return String(v[lang] ?? v.fr ?? v.en ?? "");
  return String(v);
}

// Une vraie adresse : http(s), un nom d'hôte avec un point, puis le reste. « https://quoi » (un mot complété par erreur) n'en est pas une. Même règle que la base.
export const URL_RE = /^https?:\/\/[^\s\/?#]+\.[^\s\/?#]+([\/?#]\S*)?$/i;
export const isHttpUrl = (u) => typeof u === "string" && URL_RE.test(u);
// Seuls les liens http(s) deviennent cliquables.
export function linkHtml(u, label) {
  if (!isHttpUrl(u)) return esc(label ?? u);
  return `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(label ?? u)}</a>`;
}

/* ---------------- couleur du studio ---------------- */
export const DEFAULT_BRAND = "#1F2937";
export const safeBrand = (c) => (typeof c === "string" && /^#[0-9a-fA-F]{6}$/.test(c) ? c : DEFAULT_BRAND);
export function luminance(hex) {
  const h = safeBrand(hex).slice(1);
  const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
// Texte lisible sur la couleur du studio : blanc ou noir selon la luminance.
export const onBrand = (hex) => (luminance(hex) > 0.179 ? "#000000" : "#ffffff");

// Rapport de contraste WCAG entre deux couleurs #rrggbb.
export function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
// Couleur lisible pour du fin ou du texte sur fond clair : celle du studio si son contraste sur blanc est d'au moins 3:1,
// sinon la même teinte assombrie jusqu'à 3:1.
export function brandInk(hex) {
  let c = safeBrand(hex);
  for (let i = 0; i < 40 && contrast(c, "#ffffff") < 3; i++) {
    const h = c.slice(1);
    c = "#" + [0, 2, 4].map((k) => Math.max(0, Math.floor(parseInt(h.slice(k, k + 2), 16) * 0.92)).toString(16).padStart(2, "0")).join("");
  }
  return c;
}

/* ---------------- dates ---------------- */
export function fmtDate(iso, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  if (!m) return "";
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (isNaN(d)) return "";
  try { return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d); }
  catch { return `${m[3]}/${m[2]}/${m[1]}`; }
}

/* ---------------- règles des questions (§4) ---------------- */
const DEF_MAX = { text: [300, 300], longtext: [4000, 4000], ranges: [30, 50], reels: [10, 30], links: [10, 20], files: [5, 10] };
export function fieldMax(f) {
  const d = DEF_MAX[f && f.type];
  if (!d) return null;
  const m = Number.isInteger(f.max) && f.max > 0 ? f.max : d[0];
  return Math.min(m, d[1]);
}
export const TC_RE = /^\d{1,3}:[0-5]\d(:[0-5]\d)?$/;
const len = (s) => Array.from(s).length;
const optsOf = (f) => (Array.isArray(f.options) ? f.options : []).filter((o) => o && typeof o.value === "string");

// Règle `when` : la question n'est affichée (et exigée) que si la réponse à when.key contient une des valeurs de when.in.
// `answers` = réponses déjà nettoyées des questions précédentes.
export function isVisible(f, answers) {
  const w = f && f.when;
  if (!w || !w.key) return true;
  const v = answers ? answers[w.key] : undefined;
  if (v == null) return false;
  const list = Array.isArray(w.in) ? w.in : [];
  return Array.isArray(v) ? v.some((x) => list.includes(x)) : list.includes(v);
}

/* ---------------- saisie guidée ---------------- */
// « 1230 » → « 12:30 », « 2:5 » → « 2:05 », « 1h12m30 » → « 1:12:30 ». Ne valide rien : TC_RE s'en charge.
export function normalizeTime(s) {
  let v = String(s ?? "").trim().toLowerCase().replace(/\s+/g, "").replace(/[.,;hms'’"]/g, ":").replace(/:{2,}/g, ":").replace(/^:|:$/g, "");
  if (!v) return "";
  if (/^\d+$/.test(v)) {
    if (v.length === 3 || v.length === 4) v = v.slice(0, -2) + ":" + v.slice(-2);
    else if (v.length === 5 || v.length === 6) v = v.slice(0, -4) + ":" + v.slice(-4, -2) + ":" + v.slice(-2);
  }
  const parts = v.split(":");
  if (parts.length >= 2 && parts.length <= 3) v = parts.map((p, i) => (i >= 1 && p.length === 1 ? "0" + p : p)).join(":");
  return v;
}

// Un lien collé sans https:// est complété. Un texte avec espace ou un autre schéma reste tel quel (donc signalé invalide).
export function normalizeLink(s) {
  const v = String(s ?? "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/\s/.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v) && !/^[^/]+:\d+(\/|$)/.test(v)) return v;
  return "https://" + v.replace(/^\/\//, "");
}

// Avant enregistrement ou envoi : complète les liens et les timecodes, comme le fait la page au fil de la saisie.
export function prepareAnswers(fields, answers) {
  const out = { ...(answers || {}) };
  for (const f of Array.isArray(fields) ? fields : []) {
    const v = out[f.key];
    if (f.type === "links" && Array.isArray(v)) out[f.key] = v.map((x) => (typeof x === "string" ? normalizeLink(x) : x));
    if ((f.type === "ranges" || f.type === "reels") && Array.isArray(v)) {
      out[f.key] = v.map((r) => (r && typeof r === "object" ? { ...r, from: typeof r.from === "string" ? normalizeTime(r.from) : r.from, to: typeof r.to === "string" ? normalizeTime(r.to) : r.to } : r));
    }
  }
  return out;
}

/* ---------------- fichiers déposés (contrat §9) ---------------- */
// MIROIR du contrat 9.1 (_portal_upload_rules en SQL) : seule copie en dur de ces valeurs dans la page, lue par cleanAnswers.
// La zone de dépôt, elle, lit la taille et les types dans `upload` (réponse de portal_brief_get).
export const FILE_RULES = {
  maxBytes: 26214400,
  types: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword",
    "image/png", "image/jpeg", "image/webp", "image/gif", "text/plain", "text/markdown"],
};
const FILE_PATH_RE = /^portail\/[0-9a-f]{32}\/[^/]{1,180}$/u;   // 9.2 : chemin d'un fichier déposé

// Un élément d'une réponse `files` : { path, name, size, type } et rien d'autre, sinon null (mal formé). Miroir de 9.2.
function cleanFile(x) {
  if (x == null || typeof x !== "object" || Array.isArray(x)) return null;
  if (typeof x.path !== "string" || !FILE_PATH_RE.test(x.path)) return null;
  if (typeof x.name !== "string") return null;
  const name = x.name.trim();
  if (!name || len(name) > 150) return null;
  if (typeof x.size !== "number" || !Number.isInteger(x.size) || x.size < 1 || x.size > FILE_RULES.maxBytes) return null;
  if (typeof x.type !== "string" || !FILE_RULES.types.includes(x.type)) return null;
  return { path: x.path, name, size: x.size, type: x.type };
}

/* ---------------- nettoyage et validation (§5) : miroir de _portal_answers_clean ---------------- */
// Renvoie { value, bad } : value = ce qui est gardé (undefined = vide), bad = une partie était mal formée.
function cleanOne(f, raw) {
  const type = f.type;
  if (raw == null) return { value: undefined, bad: false };
  if (type === "choice") {
    if (typeof raw !== "string") return { value: undefined, bad: true };
    const v = raw.trim();
    if (!v) return { value: undefined, bad: false };
    return optsOf(f).some((o) => o.value === v) ? { value: v, bad: false } : { value: undefined, bad: true };
  }
  if (type === "multi") {
    if (!Array.isArray(raw)) return { value: undefined, bad: true };
    const ok = new Set(optsOf(f).map((o) => o.value));
    let bad = false; const seen = [];
    for (const x of raw) {
      if (typeof x !== "string" || !ok.has(x)) { bad = true; continue; }
      if (!seen.includes(x)) seen.push(x);
    }
    return { value: seen.length ? seen : undefined, bad };
  }
  if (type === "text" || type === "longtext") {
    if (typeof raw !== "string") return { value: undefined, bad: true };
    const v = raw.trim();
    if (!v) return { value: undefined, bad: false };
    return len(v) > fieldMax(f) ? { value: undefined, bad: true } : { value: v, bad: false };
  }
  if (type === "ranges" || type === "reels") {
    if (!Array.isArray(raw)) return { value: undefined, bad: true };
    const reels = type === "reels", noteMax = reels ? 300 : 200;
    const rows = []; let bad = false;
    for (const r of raw) {
      if (r == null || typeof r !== "object" || Array.isArray(r)) { bad = true; continue; }
      const from = r.from == null ? "" : r.from, to = r.to == null ? "" : r.to, note = r.note == null ? "" : r.note;
      if (typeof from !== "string" || typeof to !== "string" || typeof note !== "string") { bad = true; continue; }
      const row = { from: from.trim(), to: to.trim(), note: note.trim() };
      if (!row.from && !row.to && !row.note) continue;   // ligne vide : ignorée sans erreur
      const fromOk = !row.from || TC_RE.test(row.from), toOk = !row.to || TC_RE.test(row.to);
      const need = reels ? !!(row.from || row.note) : !!(row.from && row.to);
      if (!fromOk || !toOk || !need || len(row.note) > noteMax) { bad = true; continue; }
      const out = {};   // même forme que la base : une clé vide n'est pas gardée
      if (row.from) out.from = row.from;
      if (row.to) out.to = row.to;
      if (row.note) out.note = row.note;
      rows.push(out);
    }
    const max = fieldMax(f);
    if (rows.length > max) { bad = true; rows.length = max; }
    return { value: rows.length ? rows : undefined, bad };
  }
  if (type === "links") {
    if (!Array.isArray(raw)) return { value: undefined, bad: true };
    const rows = []; let bad = false;
    for (const x of raw) {
      if (typeof x !== "string") { bad = true; continue; }   // null compris : mal formé, comme la base
      const v = x.trim();
      if (!v) continue;
      if (!URL_RE.test(v) || len(v) > 500) { bad = true; continue; }   // casse libre, comme la base
      if (!rows.includes(v)) rows.push(v);
    }
    const max = fieldMax(f);
    if (rows.length > max) { bad = true; rows.length = max; }
    return { value: rows.length ? rows : undefined, bad };
  }
  if (type === "files") {
    if (!Array.isArray(raw)) return { value: undefined, bad: true };
    const rows = []; let bad = false;
    for (const x of raw) {
      const r = cleanFile(x);
      if (!r) { bad = true; continue; }
      if (rows.some((y) => y.path === r.path)) continue;   // même chemin deux fois : on garde le premier, sans bruit
      rows.push(r);
    }
    const max = fieldMax(f);
    if (rows.length > max) { bad = true; rows.length = max; }
    return { value: rows.length ? rows : undefined, bad };
  }
  return { value: undefined, bad: false };   // type inconnu : ignoré
}

/* cleanAnswers(fields, answers, strict) → { answers, visible: [keys], error: null | { code, key } }
   - garde seulement les questions visibles, dans l'ordre, valeurs vides retirées ;
   - brouillon (strict = false) : ce qui est mal formé est écarté, jamais d'erreur ;
   - envoi (strict = true) : mal formé → brief_invalid:<key> ; obligatoire vide → brief_required:<key>. */
export function cleanAnswers(fields, answers, strict) {
  const out = {}, visible = []; let error = null;
  const src = answers && typeof answers === "object" && !Array.isArray(answers) ? answers : {};
  for (const f of Array.isArray(fields) ? fields : []) {
    if (!f || typeof f.key !== "string") continue;
    if (f.type === "section") continue;   // un titre de section n'a pas de réponse
    if (!isVisible(f, out)) continue;
    visible.push(f.key);
    const { value, bad } = cleanOne(f, src[f.key]);
    if (value !== undefined) out[f.key] = value;
    if (strict && !error) {
      if (bad) error = { code: "brief_invalid", key: f.key };
      else if (value === undefined && f.required === true) error = { code: "brief_required", key: f.key };
    }
  }
  return { answers: out, visible, error };
}

export const answeredCount = (fields, answers) => {
  const r = cleanAnswers(fields, answers, false);
  return { n: Object.keys(r.answers).length, total: r.visible.length };
};

// « 0 question sur 15 », « 1 question sur 15 », « 2 questions sur 15 » (pluriel à partir de 2).
export const progressText = (lang, n, total) => t(lang, n < 2 ? "brief.progressOne" : "brief.progress", { n, total });

// Message sous la question en défaut.
export function errorMessage(f, code, lang) {
  if (code === "brief_required") return t(lang, "err.required");
  switch (f && f.type) {
    case "choice": case "multi": return t(lang, "err.option");
    case "text": case "longtext": return t(lang, "err.text");
    case "ranges": return t(lang, "err.ranges");
    case "reels": return t(lang, "err.reels");
    case "links": return t(lang, "err.links");
    case "files": return t(lang, "err.files");
    default: return t(lang, "err.generic");
  }
}

/* ---------------- dépôt de fichiers : règles côté page (pures, testées sous Node) ---------------- */
// Type d'un fichier d'après son extension (le type annoncé par le navigateur n'est pas fiable). « » = non accepté.
const EXT_TYPES = { pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", txt: "text/plain", md: "text/markdown" };
export const fileType = (name) => { const m = /\.([^.\\/]+)$/.exec(String(name || "")); return (m && EXT_TYPES[m[1].toLowerCase()]) || ""; };
// Nom accepté dans le chemin de stockage (sans « / », lisible) ; même règle que la page de dépôt de commande.
export const safeFile = (n) => String(n).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w.\- ()]+/g, "_").replace(/\s+/g, " ").trim().slice(0, 150) || "brief";
// Nom d'affichage gardé dans la réponse : le nom d'origine, rogné, 150 caractères au plus (au-delà la base refuserait la ligne).
export const displayName = (n) => Array.from(String(n || "").trim()).slice(0, 150).join("").trim() || "file";
// Taille lisible : « 812 Ko », « 1,2 Mo », « 25 Mo » (EN : KB, MB).
export function fmtSize(bytes, lang) {
  const n = Number(bytes) || 0, en = lang === "en";
  if (n < 1024) return `${n} ${en ? "B" : "o"}`;
  if (n < 1048576) return `${Math.round(n / 1024)} ${en ? "KB" : "Ko"}`;
  const v = n / 1048576, r = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
  return `${en ? String(r) : String(r).replace(".", ",")} ${en ? "MB" : "Mo"}`;
}
// La zone de dépôt n'existe que si la base a envoyé des règles complètes (upload absent, null ou bancal : pas de zone).
export function usableUpload(up) {
  return !!(up && typeof up === "object" && typeof up.bucket === "string" && up.bucket && typeof up.dir === "string" && /^[^/]+(\/[^/]+)*$/.test(up.dir)
    && Number.isInteger(up.max_bytes) && up.max_bytes > 0 && Array.isArray(up.types) && up.types.length > 0);
}
// Attribut accept du sélecteur : les extensions connues dont le type est accepté, puis les types eux-mêmes.
export const acceptAttr = (types) => [...Object.keys(EXT_TYPES).filter((e) => (types || []).includes(EXT_TYPES[e])).map((e) => "." + e), ...(types || [])].join(",");
// Refus AVANT envoi : "" = accepté, sinon "empty" | "type" | "big" | "dup" | "max".
// used = fichiers déjà dans la réponse + envois en cours ; known = [{ name, size }] déjà présents.
export function fileProblem(file, up, used, max, known = []) {
  if (!file || !(file.size > 0)) return "empty";
  const ty = fileType(file.name);
  if (!ty || !up.types.includes(ty)) return "type";
  if (file.size > up.max_bytes) return "big";
  if (known.some((k) => k.name === displayName(file.name) && k.size === file.size)) return "dup";
  if (used >= max) return "max";
  return "";
}
// Formats acceptés, lisibles, construits depuis upload.types (« PDF, Word, PNG, JPG, WebP, GIF, texte »).
const TYPE_LABEL = { "application/pdf": "PDF", "application/msword": "Word", "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word", "image/png": "PNG", "image/jpeg": "JPG", "image/webp": "WebP", "image/gif": "GIF", "text/plain": ["texte", "text"], "text/markdown": ["texte", "text"] };
export function formatsList(types, lang) {
  const out = [];
  for (const ty of Array.isArray(types) ? types : []) {
    const l = TYPE_LABEL[ty], lab = Array.isArray(l) ? l[lang === "en" ? 1 : 0] : l || String(ty).split("/").pop().toUpperCase();
    if (!out.includes(lab)) out.push(lab);
  }
  return out.join(", ");
}
// Réponse de portal_brief_save en brouillon : files_refused = chemins que la base a écartés (introuvables). On les retire des réponses.
// Clé absente (base pas encore à jour) ou vide : rien ne change. Renvoie { answers, dropped: [{ key, name, path }] }.
export function dropRefused(fields, answers, refused) {
  const bad = new Set((Array.isArray(refused) ? refused : []).filter((x) => typeof x === "string"));
  const out = { ...(answers || {}) }, dropped = [];
  if (!bad.size) return { answers: out, dropped };
  for (const f of Array.isArray(fields) ? fields : []) {
    if (!f || f.type !== "files" || !Array.isArray(out[f.key])) continue;
    const keep = [];
    for (const x of out[f.key]) {
      if (x && typeof x === "object" && bad.has(x.path)) dropped.push({ key: f.key, name: String(x.name ?? ""), path: x.path });
      else keep.push(x);
    }
    if (keep.length !== out[f.key].length) out[f.key] = keep;
  }
  return { answers: out, dropped };
}
// Après un enregistrement de brouillon réussi : applique files_refused de la réponse `res` aux réponses et pose une note par fichier retiré
// dans `notes` (celles que la page affiche sous la question). Renvoie { answers, keys, refused: [{ why, name }] } ; refused vide = tout va bien.
export function handleSaved(fields, answers, res, notes) {
  const r = dropRefused(fields, answers, res && res.files_refused), refused = r.dropped.map((d) => ({ why: "refused", name: d.name }));
  for (const d of r.dropped) (notes[d.key] = notes[d.key] || []).push({ why: "refused", name: d.name });
  return { answers: r.answers, keys: [...new Set(r.dropped.map((d) => d.key))], refused };
}
// Au retour sur la page : fichiers de la copie locale que la réponse de la base n'a plus (questions visibles seulement).
// Sert quand la base gagne : le fichier a disparu du stockage (enregistrement à la fermeture de l'onglet, autre appareil…). Renvoie [{ key, name, path }].
export function lostFiles(fields, localAnswers, serverAnswers) {
  const vis = new Set(cleanAnswers(fields, serverAnswers, false).visible), have = new Set(), out = [];
  const files = (Array.isArray(fields) ? fields : []).filter((f) => f && f.type === "files" && vis.has(f.key));
  for (const f of files) for (const x of Array.isArray((serverAnswers || {})[f.key]) ? serverAnswers[f.key] : []) if (x && typeof x.path === "string") have.add(x.path);
  for (const f of files) for (const x of Array.isArray((localAnswers || {})[f.key]) ? localAnswers[f.key] : []) if (x && typeof x === "object" && typeof x.path === "string" && !have.has(x.path)) out.push({ key: f.key, name: String(x.name ?? ""), path: x.path });
  return out;
}
// Chemin de stockage : <dossier>/<8 hexadécimaux>-<nom nettoyé>.
export function uploadPath(dir, name, rand = randHex8()) { return `${dir}/${rand}-${safeFile(name)}`; }
export function randHex8() {
  try { return Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0")).join(""); }
  catch { return Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0"); }
}
// Adresse d'envoi : chaque segment (bucket compris) passe par encodeURIComponent.
export const uploadUrl = (base, bucket, path) => `${base}/storage/v1/object/${[bucket, ...path.split("/")].map(encodeURIComponent).join("/")}`;
// Un échec d'envoi → clé de texte : réseau coupé (statut 0) ou autre.
export const uploadErrorKey = (status) => (status === 0 ? "files.err.net" : "files.err.fail");

/* ---------------- rendu des questions (chaînes HTML) ---------------- */
const lblId = (k) => "l-" + esc(k), helpId = (k) => "h-" + esc(k), ctlId = (k) => "f-" + esc(k), errId = (k) => "e-" + esc(k);

function head(f, lang, forId) {
  const label = esc(loc(f.label, lang));
  const star = f.required ? `<span class="star" aria-hidden="true">*</span><span class="sr"> (${esc(t(lang, "req"))})</span>` : "";
  const tag = forId ? `<label class="lbl" id="${lblId(f.key)}" for="${forId}">` : `<div class="lbl" id="${lblId(f.key)}">`;
  const end = forId ? "</label>" : "</div>";
  const help = loc(f.help, lang);
  return `${tag}${label}${star}${end}` + (help ? `<p class="help" id="${helpId(f.key)}">${esc(help)}</p>` : "");
}
const describedBy = (f) => `${loc(f.help, "fr") || loc(f.help, "en") ? helpId(f.key) + " " : ""}${errId(f.key)}`;

function timeInput(f, i, which, val, lang, label) {
  return `<label class="mini"><span>${esc(label)}</span><input class="in tc" type="text" inputmode="numeric" autocomplete="off" placeholder="12:30" maxlength="9" data-k="${esc(f.key)}" data-i="${i}" data-f="${which}" value="${esc(val)}"></label>`;
}

function rangeRow(f, i, row, lang, reels, delBtn) {
  const r = row && typeof row === "object" ? row : {};
  const title = reels ? t(lang, "q.reel", { n: i + 1 }) : t(lang, "q.range", { n: i + 1 });
  const noteMax = reels ? 300 : 200;
  return `<div class="row ${reels ? "reel" : "range"}" role="group" aria-label="${esc(title)}">` +
    (reels ? `<div class="row-h">${esc(title)}</div>` : "") +
    `<div class="row-f">` +
    timeInput(f, i, "from", r.from ?? "", lang, t(lang, "q.from")) +
    timeInput(f, i, "to", r.to ?? "", lang, t(lang, "q.to")) +
    `<label class="mini note"><span>${esc(t(lang, "q.note"))}</span><input class="in" type="text" autocomplete="off" maxlength="${noteMax}" data-k="${esc(f.key)}" data-i="${i}" data-f="note" value="${esc(r.note ?? "")}"></label>` +
    (delBtn ? `<button type="button" class="icon" data-del="${esc(f.key)}" data-i="${i}" aria-label="${esc(t(lang, "q.remove") + " " + title)}"><span aria-hidden="true">×</span></button>` : "") +
    `</div></div>`;
}

// raw = valeur brute de l'état de la page (peut contenir des lignes vides en cours de saisie).
// ctx (facultatif, pour le type files) : { upload, open, pending: { <clé>: [envois en cours ou ratés] }, notes: { <clé>: [refus] } }.
// Sans ctx : pas de zone de dépôt, brief ouvert.
export function renderField(f, raw, lang, ctx) {
  const k = esc(f.key), max = fieldMax(f);
  let body = "", wrapHead = "";
  switch (f.type) {
    case "choice": {
      const cur = typeof raw === "string" ? raw : "";
      wrapHead = head(f, lang);
      body = `<div class="pills" role="radiogroup" aria-labelledby="${lblId(f.key)}" aria-describedby="${describedBy(f)}">` +
        optsOf(f).map((o) => `<label class="pill"><input type="radio" name="${ctlId(f.key)}" value="${esc(o.value)}" data-k="${k}"${cur === o.value ? " checked" : ""}><span>${esc(loc(o.label, lang))}</span></label>`).join("") + `</div>`;
      break;
    }
    case "multi": {
      const cur = Array.isArray(raw) ? raw : [];
      wrapHead = head(f, lang);
      body = `<div class="pills" role="group" aria-labelledby="${lblId(f.key)}" aria-describedby="${describedBy(f)}">` +
        optsOf(f).map((o) => `<label class="pill"><input type="checkbox" value="${esc(o.value)}" data-k="${k}"${cur.includes(o.value) ? " checked" : ""}><span>${esc(loc(o.label, lang))}</span></label>`).join("") + `</div>`;
      break;
    }
    case "text": {
      wrapHead = head(f, lang, ctlId(f.key));
      body = `<input class="in" type="text" id="${ctlId(f.key)}" autocomplete="off" maxlength="${max}" data-k="${k}" aria-describedby="${describedBy(f)}" value="${esc(typeof raw === "string" ? raw : "")}"><span class="count" data-count="${k}" data-max="${max}" hidden></span>`;
      break;
    }
    case "longtext": {
      wrapHead = head(f, lang, ctlId(f.key));
      body = `<textarea class="in grow" id="${ctlId(f.key)}" rows="3" maxlength="${max}" data-k="${k}" aria-describedby="${describedBy(f)}">${esc(typeof raw === "string" ? raw : "")}</textarea><span class="count" data-count="${k}" data-max="${max}" hidden></span>`;
      break;
    }
    case "ranges": {
      const rows = Array.isArray(raw) && raw.length ? raw : [{}];
      wrapHead = head(f, lang);
      body = `<div class="rows" role="group" aria-labelledby="${lblId(f.key)}" aria-describedby="${describedBy(f)}">` + rows.map((r, i) => rangeRow(f, i, r, lang, false, true)).join("") + `</div>` +
        (rows.length < max ? `<button type="button" class="btn ghost add" data-add="${k}">+ ${esc(t(lang, "q.addRange"))}</button>` : "");
      break;
    }
    case "reels": {
      const arr = Array.isArray(raw) ? raw : [];
      wrapHead = head(f, lang);
      body = `<div class="rows" role="group" aria-labelledby="${lblId(f.key)}" aria-describedby="${describedBy(f)}">` + Array.from({ length: max }, (_, i) => rangeRow(f, i, arr[i], lang, true, false)).join("") + `</div>`;
      break;
    }
    case "links": {
      const rows = Array.isArray(raw) && raw.length ? raw : [""];
      wrapHead = head(f, lang);
      body = `<div class="rows" role="group" aria-labelledby="${lblId(f.key)}" aria-describedby="${describedBy(f)}">` + rows.map((v, i) =>
        `<div class="row linkrow"><label class="mini grow1"><span class="sr">${esc(t(lang, "q.link", { n: i + 1 }))}</span><input class="in" type="text" inputmode="url" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="https://…" maxlength="500" data-k="${k}" data-i="${i}" value="${esc(typeof v === "string" ? v : "")}"></label>` +
        `<button type="button" class="icon" data-del="${k}" data-i="${i}" aria-label="${esc(t(lang, "q.remove") + " " + t(lang, "q.link", { n: i + 1 }))}"><span aria-hidden="true">×</span></button></div>`).join("") + `</div>` +
        (rows.length < max ? `<button type="button" class="btn ghost add" data-add="${k}">+ ${esc(t(lang, "q.addLink"))}</button>` : "");
      break;
    }
    case "files": {
      const done = (Array.isArray(raw) ? raw : []).filter((x) => x && typeof x === "object" && typeof x.name === "string");
      const pend = (ctx && ctx.pending && ctx.pending[f.key]) || [], notes = ((ctx && ctx.notes && ctx.notes[f.key]) || []).map((n) => (n && typeof n === "object" ? t(lang, "files.err." + n.why, { ...n, size: fmtSize(n.bytes, lang), formats: formatsList(n.types, lang) }) : String(n)));
      const open = !ctx || ctx.open !== false, up = ctx && ctx.open !== false && usableUpload(ctx.upload) ? ctx.upload : null;
      wrapHead = head(f, lang);
      const items = done.map((x, i) => `<li class="file"><span class="fname">${esc(x.name)}</span><span class="fsize">${esc(fmtSize(x.size, lang))}</span>` +
          (open ? `<button type="button" class="icon" data-rmfile="${k}" data-i="${i}" aria-label="${esc(t(lang, "files.remove", { name: x.name }))}"><span aria-hidden="true">×</span></button>` : "") + `</li>`).join("") +
        pend.map((p) => p.err
          ? `<li class="file bad" data-pend="${esc(p.id)}"><span class="fname">${esc(p.name)}</span><span class="fsize">${esc(fmtSize(p.size, lang))}</span><span class="ferr">${esc(t(lang, p.err))}</span>` +
            `<button type="button" class="btn small" data-retry="${esc(p.id)}" data-fk="${k}">${esc(t(lang, "retry"))}</button>` +
            `<button type="button" class="icon" data-dismiss="${esc(p.id)}" data-fk="${k}" aria-label="${esc(t(lang, "files.remove", { name: p.name }))}"><span aria-hidden="true">×</span></button></li>`
          : `<li class="file pend" data-pend="${esc(p.id)}"><span class="fname">${esc(p.name)}</span><span class="fsize">${esc(fmtSize(p.size, lang))}</span>` +
            `<progress class="fbar" max="100" value="${p.pct | 0}" aria-label="${esc(t(lang, "files.progress", { name: p.name }))}"></progress><span class="fpct" aria-hidden="true">${p.pct | 0} %</span>` +
            `<button type="button" class="btn small fcancel" data-cancel="${esc(p.id)}" data-fk="${k}" aria-label="${esc(t(lang, "files.cancelAria", { name: p.name }))}">${esc(t(lang, "files.cancel"))}</button></li>`).join("");
      let zone = "";
      if (up) {
        if (done.length + pend.length >= max) zone = `<p class="drop-full">${esc(t(lang, "files.full", { n: max }))}</p>`;
        else zone = `<div class="drop" data-drop="${k}"><p class="drop-t">${esc(t(lang, "files.drop"))}</p>` +
          `<button type="button" class="btn" data-pick="${k}" aria-describedby="${describedBy(f)}">${esc(t(lang, max > 1 ? "files.pickMany" : "files.pick"))}</button>` +
          `<input type="file" class="sr" tabindex="-1" aria-hidden="true" data-fk="${k}"${max - done.length - pend.length > 1 ? " multiple" : ""} accept="${esc(acceptAttr(up.types))}">` +
          `<p class="drop-h">${esc(t(lang, max < 2 ? "files.limitsOne" : "files.limits", { n: max, size: fmtSize(up.max_bytes, lang) }))}</p></div>`;
      }
      body = `<div class="files-box" role="group" aria-labelledby="${lblId(f.key)}" aria-describedby="${describedBy(f)}">` +
        (items ? `<ul class="flist" aria-label="${esc(t(lang, "files.list"))}">${items}</ul>` : "") + zone +
        (notes.length ? `<ul class="fnotes">${notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : "") + `</div>`;
      break;
    }
    default: return "";
  }
  return `<div class="q" id="q-${k}" data-q="${k}" data-type="${esc(f.type)}">${wrapHead}${body}<p class="err" id="${errId(f.key)}" role="alert"></p></div>`;
}

// Toutes les questions visibles, dans l'ordre.
export function renderForm(fields, raw, lang, ctx) {
  const { visible } = cleanAnswers(fields, raw, false);
  const show = new Set(visible);
  let html = "", pending = null;
  for (const f of Array.isArray(fields) ? fields : []) {
    if (!f) continue;
    if (f.type === "section") { pending = f; continue; }
    if (!show.has(f.key)) continue;
    if (pending) { html += renderSection(pending, lang); pending = null; }
    html += renderField(f, (raw || {})[f.key], lang, ctx);
  }
  return html;
}

// Titre de section : un repère de lecture, pas une question. Écrit seulement s'il y a au moins une question visible dessous.
export function renderSection(f, lang) {
  const help = loc(f.help, lang);
  return `<div class="sec-h" data-sec="${esc(f.key)}"><h2>${esc(loc(f.label, lang))}</h2>${help ? `<p class="help">${esc(help)}</p>` : ""}</div>`;
}

// Nombre de vraies questions (sans les titres de section).
export const questionCount = (fields) => (Array.isArray(fields) ? fields : []).filter((f) => f && f.type !== "section").length;

/* ---------------- lecture seule : récapitulatif et texte lisible ---------------- */
function optLabel(f, value, lang) {
  const o = optsOf(f).find((x) => x.value === value);
  return o ? loc(o.label, lang) : value;
}

// Le moment d'un reel : « 02:10 → 02:50 », « 02:10 » (début seul) ou « → 02:50 » (fin seule). Même règle que la base.
export const reelTime = (r) => (r.from && r.to ? `${r.from} → ${r.to}` : r.from ? r.from : r.to ? `→ ${r.to}` : "");

export function renderSummary(fields, answers, lang) {
  const { answers: a } = cleanAnswers(fields, answers, false);
  const groups = [{ title: "", items: [] }];   // un groupe par section ; le premier sans titre
  let items = groups[0].items;
  for (const f of Array.isArray(fields) ? fields : []) {
    if (f && f.type === "section") { const g = { title: loc(f.label, lang), items: [] }; groups.push(g); items = g.items; continue; }
    const v = a[f.key];
    if (v === undefined) continue;
    let dd = "";
    switch (f.type) {
      case "choice": dd = esc(optLabel(f, v, lang)); break;
      case "multi": dd = esc(v.map((x) => optLabel(f, x, lang)).join(", ")); break;
      case "text": case "longtext": dd = `<span class="pre">${esc(v)}</span>`; break;
      case "ranges": dd = `<ul>` + v.map((r) => `<li>${esc(r.from)} → ${esc(r.to)}${r.note ? ` <span class="muted">(${esc(r.note)})</span>` : ""}</li>`).join("") + `</ul>`; break;
      case "reels": dd = `<ul>` + v.map((r, i) => `<li><strong>${esc(t(lang, "q.reel", { n: i + 1 }))}</strong> ${esc(reelTime(r))}${r.note ? ` ${reelTime(r) ? "— " : ""}<span class="pre">${esc(r.note)}</span>` : ""}</li>`).join("") + `</ul>`; break;
      case "links": dd = `<ul>` + v.map((u) => `<li>${linkHtml(u)}</li>`).join("") + `</ul>`; break;
      case "files": dd = `<ul>` + v.map((x) => `<li>${esc(x.name)}</li>`).join("") + `</ul>`; break;
      default: continue;
    }
    items.push(`<div class="sum-i"><dt>${esc(loc(f.label, lang))}</dt><dd>${dd}</dd></div>`);
  }
  const filled = groups.filter((g) => g.items.length);
  if (!filled.length) return `<p class="muted">${esc(t(lang, "sum.empty"))}</p>`;
  return filled.map((g) => (g.title ? `<h3 class="sum-h">${esc(g.title)}</h3>` : "") + `<dl class="sum">${g.items.join("")}</dl>`).join("");
}

// Texte lisible du brief : même forme que _portal_brief_text côté base.
export function briefText(fields, answers, lang) {
  const { answers: a } = cleanAnswers(fields, answers, false);
  const colon = lang === "en" ? ": " : " : ";
  const lines = []; let sec = null;
  for (const f of Array.isArray(fields) ? fields : []) {
    if (f && f.type === "section") { sec = loc(f.label, lang); continue; }
    const v = a[f.key];
    if (v === undefined) continue;
    if (sec !== null) { if (lines.length) lines.push(""); lines.push(`— ${sec} —`); sec = null; }
    const label = loc(f.label, lang);
    switch (f.type) {
      case "choice": lines.push(label + colon + optLabel(f, v, lang)); break;
      case "multi": lines.push(label + colon + v.map((x) => optLabel(f, x, lang)).join(", ")); break;
      case "text": case "longtext": lines.push(label + colon + v); break;
      case "ranges": lines.push(label + colon + v.map((r) => `${r.from} → ${r.to}${r.note ? ` (${r.note})` : ""}`).join(" ; ")); break;
      case "reels": lines.push(label + colon.trimEnd()); v.forEach((r, i) => lines.push(`${t(lang, "q.reel", { n: i + 1 })}${lang === "en" ? ": " : " : "}${[reelTime(r), r.note].filter(Boolean).join(" — ")}`)); break;
      case "links": lines.push(label + colon.trimEnd()); v.forEach((u) => lines.push(u)); break;
      case "files": lines.push(label + colon + v.map((x) => x.name).join(", ")); break;
      default: break;
    }
  }
  return lines.join("\n");
}

// En-tête : logo (https:// seulement) avec repli sur le nom ; le repli est posé par la page (événement error).
export function studioHeader(studio) {
  const name = esc(studio && studio.name);
  const logo = studio && typeof studio.logo_url === "string" && /^https:\/\//.test(studio.logo_url) ? studio.logo_url : "";
  return logo
    ? `<div class="brandbar"><img class="logo" src="${esc(logo)}" alt="${name}" referrerpolicy="no-referrer" data-fallback="${name}"></div>`
    : `<div class="brandbar"><span class="brandname">${name}</span></div>`;
}

/* ---------------- navigateur seulement (jamais appelé à l'import) ---------------- */
export function applyBrand(color, doc = document) {
  const c = safeBrand(color), ink = brandInk(c), st = doc.documentElement.style;
  st.setProperty("--brand", c);              // fonds pleins
  st.setProperty("--on-brand", onBrand(c));  // texte sur fonds pleins
  st.setProperty("--brand-ink", ink);        // texte et traits fins sur fond clair
  st.setProperty("--focus", ink);
}

// Envoi d'un fichier vers le stockage, avec la progression (XMLHttpRequest). Même clé publique que les appels de la page.
// Échec : l'erreur porte .status (0 = réseau coupé, envoi interrompu ou resté sans signe de vie) ; rien n'est ajouté nulle part ici.
// Délai d'INACTIVITÉ seulement (idleMs, 45 s) : toute progression ou réponse le remet à zéro, y compris après 100 % ; pas de délai total.
// La promesse porte .abort() : annulation voulue, l'erreur a alors .aborted = true. Minuteries et XMLHttpRequest injectables (tests).
export function sendFile(url, { file, type, onProgress, idleMs = 45000, setT = (f, ms) => setTimeout(f, ms), clearT = (h) => clearTimeout(h), XHR } = {}) {
  let x, timer, done = false, killed = "", failFn = () => {};
  const promise = new Promise((resolve, reject) => {
    const settle = (fn) => { if (done) return; done = true; clearT(timer); fn(); };
    const fail = (status, why) => settle(() => { const e = new Error("upload"); e.status = status; e.code = "upload"; e.idle = why === "idle"; e.aborted = why === "abort"; reject(e); });
    failFn = fail;
    const arm = () => { if (done) return; clearT(timer); if (idleMs > 0) timer = setT(() => { killed = "idle"; try { x.abort(); } catch { /* déjà fini */ } fail(0, "idle"); }, idleMs); };
    try {
      x = new (XHR || XMLHttpRequest)();
      x.open("POST", url);
      x.setRequestHeader("apikey", SUPABASE_ANON);
      x.setRequestHeader("Authorization", "Bearer " + SUPABASE_ANON);
      x.setRequestHeader("Content-Type", type);
      x.setRequestHeader("x-upsert", "false");
      x.upload.onprogress = (ev) => { arm(); if (onProgress && ev.lengthComputable && ev.total > 0) onProgress(Math.min(100, Math.floor((ev.loaded / ev.total) * 100))); };
      x.onprogress = arm; x.onreadystatechange = arm;
      x.onload = () => (x.status >= 200 && x.status < 300 ? settle(resolve) : fail(x.status));
      x.onerror = () => fail(0);
      x.onabort = () => fail(0, killed);
      x.ontimeout = () => fail(0);
      arm();
      x.send(file);
    } catch { fail(0); }
  });
  promise.abort = () => { if (done) return; killed = "abort"; try { x && x.abort(); } catch { /* ignore */ } failFn(0, "abort"); };
  return promise;
}

/* ---------------- mécanique des envois de fichiers (testée sous Node, sans navigateur) ---------------- */
// createUploads gère les envois en cours ou ratés de la page : file d'attente par question, délai d'inactivité, annulation,
// questions devenues cachées, « peut-on envoyer le brief ? ». La page lui donne des rappels ; elle ne garde aucun état d'envoi elle-même.
//   getUpload() → règles `upload` de la base ou null ; getBase() → base de l'API ; getVisible() → clés des questions visibles (ou null) : une ligne d'une question cachée ne compte jamais ; onDone(key, file) → la page ajoute à ses réponses ;
//   onChange(key, focus, { soft }) → redessiner la question (soft : ne déplacer le focus que s'il était déjà dans la question ou nulle part) ; onProgress(p) ; onEvent({ type, key, p?, notes? }) → annonces (une seule fois chacune).
export function createUploads({ getUpload, getBase, getVisible, send = sendFile, setT, clearT, idleMs = 45000, onDone, onChange, onProgress, onEvent } = {}) {
  const pending = {}, notes = {}; let seq = 0;
  const emit = (e) => { if (onEvent) onEvent(e); };
  const change = (key, focus, opts) => { if (onChange) onChange(key, focus, opts); };
  const isVis = (key) => { const v = getVisible ? getVisible() : null; return !v || v.includes(key); };
  const inList = (key, p) => (pending[key] || []).includes(p);
  async function run(key, p) {
    const up = getUpload(); if (!up) { pending[key] = (pending[key] || []).filter((x) => x !== p); return; }
    p.state = "sending"; p.err = ""; p.pct = 0; p.cancelled = false;
    emit({ type: "start", key, p });
    const path = uploadPath(up.dir, p.raw);   // un nouveau chemin à chaque essai
    const pr = send(uploadUrl(getBase(), up.bucket, path), { file: p.file, type: p.type, idleMs, setT, clearT, onProgress: (n) => { p.pct = n; if (onProgress) onProgress(p); } });
    p.abort = () => { try { pr && pr.abort && pr.abort(); } catch { /* ignore */ } };
    try { await pr; }
    catch (e) {
      if (p.cancelled || !inList(key, p)) return;
      p.state = "error"; p.err = uploadErrorKey(e && e.status); p.abort = null;
      emit({ type: "error", key, p }); change(key, `[data-retry="${p.id}"]`, { soft: true });   // soft : ne vole pas le focus pendant une frappe ailleurs
      return;
    }
    if (p.cancelled || !inList(key, p)) return;
    pending[key] = pending[key].filter((x) => x !== p);
    if (onDone) onDone(key, { path, name: p.name, size: p.size, type: p.type });
    emit({ type: "done", key, p });
    change(key, undefined);
  }
  const api = {
    pending, notes,
    // Dépose des fichiers choisis : refus avant envoi (notes), puis un envoi par fichier accepté.
    take(key, files, { max, known = [] } = {}) {
      const up = getUpload(); if (!up) return;
      const fresh = (pending[key] = pending[key] || []), msgs = [], started = [];
      for (const file of Array.from(files || [])) {
        const kn = [...known, ...fresh].filter((x) => x && typeof x.name === "string");
        const why = fileProblem(file, up, kn.length, max, kn), name = displayName(file && file.name);
        if (why) { msgs.push({ why, name, bytes: up.max_bytes, n: max, types: up.types }); continue; }
        const p = { id: "u" + ++seq, name, size: file.size, type: fileType(file.name), file, raw: file.name, pct: 0, err: "", state: "sending", cancelled: false };
        fresh.push(p); started.push(p);
      }
      notes[key] = msgs;
      if (msgs.length) emit({ type: "refused", key, notes: msgs });
      change(key, "[data-pick]");
      started.forEach((p) => run(key, p));
    },
    retry(key, id) { const p = (pending[key] || []).find((x) => x.id === id); if (!p || p.state !== "error") return; notes[key] = []; p.err = ""; p.state = "sending"; p.pct = 0; change(key, null); run(key, p); },
    // Annule un envoi en cours : interrompu et ligne retirée.
    cancel(key, id) { const p = (pending[key] || []).find((x) => x.id === id); if (!p) return; p.cancelled = true; if (p.abort) p.abort(); pending[key] = pending[key].filter((x) => x !== p); change(key, "[data-pick]"); },
    // Retire une ligne en échec.
    dismiss(key, id) { pending[key] = (pending[key] || []).filter((x) => x.id !== id); notes[key] = []; change(key, "[data-pick]"); },
    // La question n'est plus visible : on interrompt ses envois et on vide ses lignes (en cours ou en échec).
    dropKey(key) { for (const p of pending[key] || []) { p.cancelled = true; if (p.abort) p.abort(); } pending[key] = []; notes[key] = []; change(key, null); },
    syncVisible(visible) { const v = new Set(visible); for (const k of Object.keys(pending)) if (!v.has(k) && ((pending[k] || []).length || (notes[k] || []).length)) api.dropKey(k); },
    // Envois réellement en vol (jamais les lignes en échec).
    active() { return Object.entries(pending).reduce((n, [k, l]) => n + (isVis(k) ? l.filter((p) => p.state === "sending" && !p.cancelled).length : 0), 0); },
    failed() { for (const [key, l] of Object.entries(pending)) { if (!isVis(key)) continue; const p = l.find((x) => x.state === "error"); if (p) return { key, p }; } return null; },
    // Peut-on envoyer le brief ? "" = oui ; "busy" = un fichier part encore ; "failed" = un fichier n'a pas pu être ajouté.
    block() { return api.active() > 0 ? "busy" : api.failed() ? "failed" : ""; },
  };
  return api;
}

export function lsGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
export function lsSet(key, value) { try { localStorage.setItem(key, value); } catch { /* stockage refusé */ } }
export function lsDel(key) { try { localStorage.removeItem(key); } catch { /* stockage refusé */ } }

/* ---------------- copie locale des réponses ---------------- */
// Copie stockée : { answers, at, synced } ; at = dernière frappe (ISO), synced = la base a confirmé CET état.
// Un ancien format (objet de réponses nu) est lu comme non synchronisé.
export function readBackup(raw) {
  let o; try { o = typeof raw === "string" ? JSON.parse(raw) : raw; } catch { return null; }
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  if (o.answers && typeof o.answers === "object" && !Array.isArray(o.answers)) return { answers: o.answers, at: typeof o.at === "string" ? o.at : "", synced: o.synced === true };
  return Object.keys(o).length ? { answers: o, at: "", synced: false } : null;
}
// Qui gagne au chargement : "local" ou "server". Une copie non synchronisée n'est jamais écrasée par la base.
export function pickSource(local, server) {
  if (!local) return "server";
  if (!local.synced) return "local";
  const srv = server || {}, saved = Date.parse(srv.saved_at || ""), at = Date.parse(local.at || "");
  const serverEmpty = !srv.saved_at && !Object.keys(srv.answers || {}).length;
  if (serverEmpty) return "local";
  if (!isNaN(at) && (isNaN(saved) || at > saved)) return "local";
  return "server";
}

// Logo cassé → le nom du studio en texte.
export function logoFallback(root) {
  root.addEventListener("error", (e) => {
    const img = e.target;
    if (img && img.tagName === "IMG" && img.classList.contains("logo")) {
      const span = document.createElement("span");
      span.className = "brandname"; span.textContent = img.getAttribute("data-fallback") || "";
      img.replaceWith(span);
    }
  }, true);
}
