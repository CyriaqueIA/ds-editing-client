/* Page des sessions : textes, états, rendu de la liste et outils qui ne servent qu'à cette page.
   Importe le module commun (portail.js) et lui ajoute ses textes. */
import { T, t, esc, loc, fmtDate, isHttpUrl, normalizeLink, SUPABASE_URL, apiBase } from "./portail.js";

Object.assign(T.fr, {
    "loading": "Chargement…",
    "close": "Fermer",
    "cancel": "Annuler",
    "copy": "Copier",
    "copied": "Copié",
    "st.rush_attendu": "Rushes à ajouter",
    "st.brief_attendu": "Brief attendu",
    "st.commande_en_attente": "Envoi en cours",
    "st.a_traiter": "Commande reçue",
    "st.en_montage": "En montage",
    "st.controle": "Contrôle qualité",
    "st.livre": "Livré",
    "st.annulee": "Annulée",
    "s.title": "Sessions",
    "s.invalid": "Ce lien n'est pas valide.",
    "s.new": "Nouvelle session",
    "s.help": "Ce qui attend une action de votre part, et ce qui est chez votre client ou au montage.",
    "s.t.all": "Toutes",
    "s.t.you": "À faire par vous",
    "s.t.client": "En attente du client",
    "s.t.montage": "En montage",
    "s.t.done": "Livrées",
    "s.cancelledN": "Sessions annulées · {n}",
    "step.created": "Session créée",
    "step.rushes": "Rushes",
    "step.brief": "Brief",
    "step.edit": "Montage",
    "step.done": "Livré",
    "step.s.done": "fait",
    "step.s.wait": "attendu",
    "step.s.todo": "à venir",
    "s.steps": "{n} étapes sur {total}",
    "s.stepsOne": "{n} étape sur {total}",
    "s.stepsAria": "Avancement : {list}",
    "s.miss.rushes": "Il manque : les rushes",
    "s.miss.brief": "Il manque : le brief",
    "s.miss.both": "Il manque : les rushes et le brief",
    "s.fillFor": "Remplir à la place du client",
    "s.pill.terms": "Conditions à accepter",
    "s.hint.terms": "La commande partira dès que vous aurez accepté les nouvelles conditions dans votre espace client.",
    "s.hint.rate": "Beaucoup de commandes cette heure-ci. L'envoi repart tout seul tant que cette page reste ouverte.",
    "s.hint.other": "L'envoi a pris du retard. Il repart tout seul tant que cette page reste ouverte. Si cela dure, prévenez votre contact habituel.",
  "s.hint.space": "Ouvrir mon espace client",
  "s.rushes.saveGo": "Enregistrer et lancer la commande",
  "s.rushes.warnGo": "Le brief est déjà là : dès l'enregistrement, la commande part au montage et ce lien ne pourra plus être changé. Vérifiez-le.",
  "s.n.warnGo": "Cette formule n'a pas de brief : avec un lien de rushes, la commande part au montage dès la création et ce lien ne pourra plus être changé. Vérifiez-le.",
  "s.copyFail": "Copie impossible : sélectionnez le lien et copiez-le.",
    "s.empty": "Aucune session. Créez la première.",
    "s.emptyFilter": "Aucune session dans cette liste.",
    "s.col.session": "Session",
    "s.col.formula": "Formule et livrables",
    "s.col.marks": "Avancement",
    "s.col.actions": "Actions",
    "s.order": "Commande n° {n}",
    "s.shoot": "Tournage du {date}",
    "s.copyLink": "Copier le lien du brief",
    "s.addRushes": "Ajouter les rushes",
    "s.editRushes": "Modifier les rushes",
    "s.viewBrief": "Voir le brief",
    "s.cancelSession": "Annuler la session",
    "s.locked": "La commande est déjà partie, cette session ne peut plus être modifiée.",
    "s.refresh.err": "Impossible d'actualiser la liste. Nouvel essai dans une minute.",
    "s.rushes.title": "Liens des rushes",
    "s.rushes.help": "Un lien par ligne (Drive, Dropbox, WeTransfer…). Dès que le brief est envoyé et qu'un lien est présent, la commande part toute seule.",
    "s.rushes.label": "Liens",
    "s.rushes.save": "Enregistrer",
    "s.rushes.bad": "Un des liens n'est pas valide. Exemple : https://exemple.com",
    "s.cancel.title": "Annuler cette session ?",
    "s.cancel.text": "Le lien du brief ne fonctionnera plus. Cette action est définitive.",
    "s.cancel.yes": "Oui, annuler la session",
    "s.cancel.no": "Non, la garder",
    "s.brief.title": "Brief de {name}",
    "s.brief.draft": "Brouillon : le client n'a pas encore envoyé son brief.",
    "s.brief.sent": "Brief envoyé.",
    "s.brief.noBrief": "Cette formule n'a pas de brief.",
    "s.n.title": "Nouvelle session",
    "s.n.t": "Titre de la session",
    "s.n.tHelp": "Par exemple : Épisode 12, avec Camille.",
    "s.n.c": "Nom du client",
    "s.n.d": "Date du tournage (facultatif)",
    "s.n.f": "Formule",
    "s.n.fSel": "Choisissez une formule",
    "s.n.fDeliv": "Livrables : {list}",
    "s.n.lang": "Langue du brief",
    "s.n.rushes": "Lien des rushes (facultatif)",
    "s.n.rushesHelp": "Vous pourrez l'ajouter plus tard.",
    "s.n.email": "Votre e-mail",
    "s.n.emailHelp": "L'adresse de votre studio, pour nos notifications.",
    "s.n.create": "Créer la session",
    "s.n.creating": "Création…",
    "s.n.noFormulas": "Vos formules ne sont pas encore réglées. Écrivez-nous pour les activer.",
    "s.n.termsFirst": "Acceptez d'abord les conditions dans votre espace client.",
    "s.n.termsLink": "Lire les conditions",
    "s.e.bad_formula": "Choisissez une formule.",
    "s.e.no_title": "Donnez un titre à la session.",
    "s.e.no_client": "Indiquez le nom du client.",
    "s.e.bad_email": "Cette adresse e-mail n'est pas valide.",
    "s.e.terms": "Cochez la case pour accepter les conditions.",
    "s.e.terms_not_accepted": "Acceptez d'abord les conditions dans votre espace client.",
    "s.e.rate_limit": "Trop de demandes. Réessayez dans quelques minutes.",
    "s.e.bad_rushes": "Ce lien n'est pas valide. Exemple : https://exemple.com",
    "s.e.generic": "La création n'a pas abouti. Réessayez dans un instant.",
    "s.e.offline": "Connexion impossible. Vérifiez votre réseau et réessayez.",
    "s.ok.title": "Session créée",
    "s.ok.text": "Envoyez ce lien à votre client. Il remplit son brief sans compte.",
    "s.ok.linkLabel": "Lien du brief",
    "s.ok.msgLabel": "Message prêt à envoyer",
    "s.ok.msg": "Bonjour {name}, voici le lien pour nous donner vos consignes de montage : {link}",
    "s.ok.another": "Créer une autre session",
});
Object.assign(T.en, {
    "loading": "Loading…",
    "close": "Close",
    "cancel": "Cancel",
    "copy": "Copy",
    "copied": "Copied",
    "st.rush_attendu": "Footage needed",
    "st.brief_attendu": "Waiting for brief",
    "st.commande_en_attente": "Sending",
    "st.a_traiter": "Order received",
    "st.en_montage": "Editing",
    "st.controle": "Quality check",
    "st.livre": "Delivered",
    "st.annulee": "Cancelled",
    "s.title": "Sessions",
    "s.invalid": "This link is not valid.",
    "s.new": "New session",
    "s.help": "What needs your action, and what is with your client or in editing.",
    "s.t.all": "All",
    "s.t.you": "Your action needed",
    "s.t.client": "Waiting on client",
    "s.t.montage": "Editing",
    "s.t.done": "Delivered",
    "s.cancelledN": "Cancelled sessions · {n}",
    "step.created": "Session created",
    "step.rushes": "Footage",
    "step.brief": "Brief",
    "step.edit": "Editing",
    "step.done": "Delivered",
    "step.s.done": "done",
    "step.s.wait": "waiting",
    "step.s.todo": "upcoming",
    "s.steps": "{n} of {total} steps",
    "s.stepsOne": "{n} of {total} steps",
    "s.stepsAria": "Progress: {list}",
    "s.miss.rushes": "Missing: footage",
    "s.miss.brief": "Missing: brief",
    "s.miss.both": "Missing: footage and brief",
    "s.fillFor": "Fill in for the client",
    "s.pill.terms": "Terms to accept",
    "s.hint.terms": "The order will go out as soon as you accept the new terms in your client space.",
    "s.hint.rate": "Lots of orders this hour. Sending resumes on its own while this page stays open.",
    "s.hint.other": "Sending is delayed. It resumes on its own while this page stays open. If it lasts, tell your usual contact.",
  "s.hint.space": "Open my client space",
  "s.rushes.saveGo": "Save and start the order",
  "s.rushes.warnGo": "The brief is already in: once saved, the order goes to editing and this link can no longer be changed. Please check it.",
  "s.n.warnGo": "This package has no brief: with a footage link, the order goes to editing as soon as the session is created and this link can no longer be changed. Please check it.",
  "s.copyFail": "Could not copy: select the link and copy it.",
    "s.empty": "No sessions yet. Create the first one.",
    "s.emptyFilter": "No sessions in this list.",
    "s.col.session": "Session",
    "s.col.formula": "Package and deliverables",
    "s.col.marks": "Progress",
    "s.col.actions": "Actions",
    "s.order": "Order no. {n}",
    "s.shoot": "Shoot on {date}",
    "s.copyLink": "Copy the brief link",
    "s.addRushes": "Add the footage",
    "s.editRushes": "Edit the footage",
    "s.viewBrief": "View the brief",
    "s.cancelSession": "Cancel the session",
    "s.locked": "The order has already gone out, this session can no longer be changed.",
    "s.refresh.err": "Could not refresh the list. Trying again in a minute.",
    "s.rushes.title": "Footage links",
    "s.rushes.help": "One link per line (Drive, Dropbox, WeTransfer…). As soon as the brief is sent and a link is there, the order goes out by itself.",
    "s.rushes.label": "Links",
    "s.rushes.save": "Save",
    "s.rushes.bad": "One of the links is not valid. Example: https://example.com",
    "s.cancel.title": "Cancel this session?",
    "s.cancel.text": "The brief link will stop working. This cannot be undone.",
    "s.cancel.yes": "Yes, cancel the session",
    "s.cancel.no": "No, keep it",
    "s.brief.title": "{name}'s brief",
    "s.brief.draft": "Draft: the client has not sent the brief yet.",
    "s.brief.sent": "Brief sent.",
    "s.brief.noBrief": "This package has no brief.",
    "s.n.title": "New session",
    "s.n.t": "Session title",
    "s.n.tHelp": "For example: Episode 12, with Camille.",
    "s.n.c": "Client name",
    "s.n.d": "Shoot date (optional)",
    "s.n.f": "Package",
    "s.n.fSel": "Choose a package",
    "s.n.fDeliv": "Deliverables: {list}",
    "s.n.lang": "Brief language",
    "s.n.rushes": "Footage link (optional)",
    "s.n.rushesHelp": "You can add it later.",
    "s.n.email": "Your email",
    "s.n.emailHelp": "Your studio's address, for our notifications.",
    "s.n.create": "Create the session",
    "s.n.creating": "Creating…",
    "s.n.noFormulas": "Your packages are not set up yet. Write to us to activate them.",
    "s.n.termsFirst": "Please accept the terms in your client space first.",
    "s.n.termsLink": "Read the terms",
    "s.e.bad_formula": "Choose a package.",
    "s.e.no_title": "Give the session a title.",
    "s.e.no_client": "Enter the client's name.",
    "s.e.bad_email": "This email address is not valid.",
    "s.e.terms": "Tick the box to accept the terms.",
    "s.e.terms_not_accepted": "Please accept the terms in your client space first.",
    "s.e.rate_limit": "Too many requests. Please try again in a few minutes.",
    "s.e.bad_rushes": "This link is not valid. Example: https://example.com",
    "s.e.generic": "The session could not be created. Please try again in a moment.",
    "s.e.offline": "Cannot connect. Check your network and try again.",
    "s.ok.title": "Session created",
    "s.ok.text": "Send this link to your client. They fill in their brief without an account.",
    "s.ok.linkLabel": "Brief link",
    "s.ok.msgLabel": "Message ready to send",
    "s.ok.msg": "Hi {name}, here is the link to give us your editing instructions: {link}",
    "s.ok.another": "Create another session",
});

// Site neutre du brief : il ne porte pas notre nom et ne sert que la page de brief, à sa racine (publié par tools/publish_brief.py).
export const BRIEF_SITE = "https://mybrief.studio/";

// Adresse absolue du brief d'une session. En production : le site neutre (le client final ne voit jamais notre domaine).
// En test local (api=local sur localhost) : le fichier voisin, servi par le faux serveur.
export function briefUrl(token, loc = globalThis.location) {
  const local = apiBase(loc) !== SUPABASE_URL;
  const u = local ? new URL("brief.html", loc.href) : new URL(BRIEF_SITE);
  if (local) u.searchParams.set("api", "local");   // propage le test local, inerte en production
  u.hash = "s=" + token;   // le jeton passe après le # : il ne part vers aucun serveur
  return u.href;
}

/* ---------------- sessions (page du studio) ---------------- */
export const STATUSES = ["rush_attendu", "brief_attendu", "commande_en_attente", "a_traiter", "en_montage", "controle", "livre", "annulee"];
export const statusLabel = (s, lang) => (STATUSES.includes(s) ? t(lang, "st." + s) : String(s || ""));

export function deliverablesText(list, lang) {
  return (Array.isArray(list) ? list : []).map((d) => `${Number(d.qty) || 0} × ${lang === "en" ? d.label_en || d.label_fr || d.key : d.label_fr || d.label_en || d.key}`).join(" · ");
}

// Une session se modifie (rushes, annulation) tant que la commande n'existe pas et qu'elle n'est pas annulée.
export const canEdit = (s) => !s.order && !s.cancelled_at && s.status !== "annulee";

/* sessionView : tout ce que la liste affiche d'une session se calcule ici, à partir de l'objet session du contrat (§7.4).
   La PREMIÈRE règle vraie gagne. */
export const BUCKETS = ["all", "a_vous", "client", "montage", "livrees"];
const STEP_KEYS = ["created", "rushes", "brief", "edit", "done"];
export function sessionView(s, lang) {
  const st = s.status, hasRushes = !!s.has_rushes, briefDone = !!(s.brief && s.brief.submitted_at) || s.questions === 0;
  let bucket, pill, next, hint = null;
  const P = (key, tone) => ({ label: t(lang, key), tone });
  const N = (action, key) => ({ action, label: t(lang, key) });
  if (st === "annulee") { bucket = "annulees"; pill = P("st.annulee", "off"); next = null; }
  else if (st === "livre") { bucket = "livrees"; pill = P("st.livre", "ok"); next = N("view", "s.viewBrief"); }
  else if (st === "controle") { bucket = "montage"; pill = P("st.controle", "run"); next = N("view", "s.viewBrief"); }
  else if (st === "en_montage") { bucket = "montage"; pill = P("st.en_montage", "run"); next = N("view", "s.viewBrief"); }
  else if (st === "a_traiter") { bucket = "montage"; pill = P("st.a_traiter", "run"); next = N("view", "s.viewBrief"); }
  else if (!hasRushes) { bucket = "a_vous"; pill = P("st.rush_attendu", "todo"); next = N("rushes", "s.addRushes"); }
  else if (!(s.brief && s.brief.submitted_at)) { bucket = "client"; pill = P("st.brief_attendu", "wait"); next = N("copy", "s.copyLink"); }
  else if (s.order_issue === "terms_not_accepted") { bucket = "a_vous"; pill = P("s.pill.terms", "todo"); next = N("view", "s.viewBrief"); hint = t(lang, "s.hint.terms"); }
  else { bucket = "montage"; pill = P("st.commande_en_attente", "run"); next = N("view", "s.viewBrief"); hint = s.order_issue === "rate_limit" ? t(lang, "s.hint.rate") : s.order_issue === "autre" ? t(lang, "s.hint.other") : null; }
  const cancelled = bucket === "annulees";
  const delivered = st === "livre", editDone = st === "controle" || st === "livre";
  const editWait = !editDone && (!!s.order || st === "commande_en_attente");
  const flags = { created: "done", rushes: hasRushes ? "done" : "wait", brief: briefDone ? "done" : "wait", edit: editDone ? "done" : editWait ? "wait" : "todo", done: delivered ? "done" : "todo" };
  const steps = cancelled ? [] : STEP_KEYS.map((key) => ({ key, label: t(lang, "step." + key), state: flags[key] }));
  const missing = cancelled ? null : !hasRushes && !briefDone ? "both" : !hasRushes ? "rushes" : !briefDone ? "brief" : null;
  return { bucket, pill, next, steps, done: steps.filter((x) => x.state === "done").length, total: steps.length, missing, hint };
}

export function tileCounts(sessions) {
  const c = { all: 0, a_vous: 0, client: 0, montage: 0, livrees: 0, annulees: 0 };
  for (const s of Array.isArray(sessions) ? sessions : []) {
    const b = sessionView(s, "fr").bucket;
    c[b]++; if (b !== "annulees") c.all++;
  }
  return c;
}

export function filterSessions(sessions, filter) {
  const list = Array.isArray(sessions) ? sessions : [];
  return list.filter((s) => { const b = sessionView(s, "fr").bucket; return filter === "all" || !BUCKETS.includes(filter) ? b !== "annulees" : b === filter; });
}

const TILE_KEY = { all: "s.t.all", a_vous: "s.t.you", client: "s.t.client", montage: "s.t.montage", livrees: "s.t.done" };
export function renderTiles(sessions, lang, filter) {
  const c = tileCounts(sessions);
  return BUCKETS.map((b) => `<button type="button" class="tile${b === "a_vous" && c.a_vous > 0 ? " hot" : ""}" data-f="${b}" aria-pressed="${filter === b}"><span class="tile-n">${c[b]}</span><span class="tile-l">${esc(t(lang, TILE_KEY[b]))}</span></button>`).join("");
}

function stepsHtml(v, lang) {
  if (!v.total) return "";
  const stateTxt = (x) => t(lang, "step.s." + x);
  const aria = t(lang, "s.stepsAria", { list: v.steps.map((x) => `${x.label} (${stateTxt(x.state)})`).join(", ") });
  const miss = v.missing ? `<p class="miss">${esc(t(lang, "s.miss." + v.missing))}</p>` : "";
  return `<div class="steps"><div class="seg-bar" role="img" aria-label="${esc(aria)}">${v.steps.map((x) => `<i class="seg ${x.state}"></i>`).join("")}</div><p class="steps-t">${esc(t(lang, v.done === 1 ? "s.stepsOne" : "s.steps", { n: v.done, total: v.total }))}</p>${miss}</div>`;
}

const defaultUrl = (token) => { try { return briefUrl(token); } catch { return ""; } };
function actionsHtml(s, v, lang, urlFor) {
  const id = esc(s.id);
  const btn = (act, label, cls) => `<button type="button" class="${cls}" data-act="${act}" data-id="${id}">${esc(label)}</button>`;
  const out = [];
  if (v.next) out.push(btn(v.next.action, v.next.label, "btn primary small"));
  const sec = [];
  const skip = v.next && v.next.action;
  const cancelled = v.bucket === "annulees";
  if (!cancelled && skip !== "copy") sec.push(btn("copy", t(lang, "s.copyLink"), "link"));
  if (canEdit(s) && skip !== "rushes") sec.push(btn("rushes", t(lang, s.has_rushes ? "s.editRushes" : "s.addRushes"), "link"));
  if (skip !== "view") sec.push(btn("view", t(lang, "s.viewBrief"), "link"));
  if (!cancelled && !(s.brief && s.brief.submitted_at)) { const u = urlFor(s.token); if (u && /^https?:\/\//i.test(u)) sec.push(`<a class="link" href="${esc(u)}" target="_blank" rel="noopener">${esc(t(lang, "s.fillFor"))}</a>`); }
  if (canEdit(s)) sec.push(btn("cancel", t(lang, "s.cancelSession"), "link danger"));
  return `<div class="acts">${out.join("")}${sec.length ? `<div class="sec">${sec.join("")}</div>` : ""}</div>`;
}

function listBlock(list, lang, urlFor, ctx = {}) {
  const formula = (s) => {
    const name = loc(s.formula && s.formula.name, lang), d = deliverablesText(s.deliverables, lang);
    return `<strong>${esc(name)}</strong>` + (d ? `<span class="sub">${esc(d)}</span>` : "");
  };
  const who = (s) => `<strong>${esc(s.title)}</strong><span class="sub">${esc(s.client_name)}${s.session_date ? " · " + esc(t(lang, "s.shoot", { date: fmtDate(s.session_date, lang) })) : ""}</span>` + (s.order && s.order.token ? `<span class="sub">${esc(t(lang, "s.order", { n: s.order.token }))}</span>` : "");
  const hintHtml = (v) => (v.hint ? `<p class="hint">${esc(v.hint)}${v.bucket === "a_vous" && ctx.spaceUrl ? ` <a href="${esc(ctx.spaceUrl)}" target="_blank" rel="noopener">${esc(t(lang, "s.hint.space"))}</a>` : ""}</p>` : "");
  const prog = (v) => `<span class="pill-st st-${v.pill.tone}">${esc(v.pill.label)}</span>${hintHtml(v)}${stepsHtml(v, lang)}`;
  const rows = list.map((s) => { const v = sessionView(s, lang); return `<tr data-id="${esc(s.id)}"><td class="c-main">${who(s)}</td><td>${formula(s)}</td><td class="c-prog">${prog(v)}</td><td>${actionsHtml(s, v, lang, urlFor)}</td></tr>`; }).join("");
  const cards = list.map((s) => { const v = sessionView(s, lang); return `<article class="scard" data-id="${esc(s.id)}"><div class="scard-h"><div>${who(s)}</div><span class="pill-st st-${v.pill.tone}">${esc(v.pill.label)}</span></div>${hintHtml(v)}<p class="scard-f">${formula(s)}</p>${stepsHtml(v, lang)}${actionsHtml(s, v, lang, urlFor)}</article>`; }).join("");
  return `<div class="tablewrap"><table class="stable"><thead><tr><th scope="col">${esc(t(lang, "s.col.session"))}</th><th scope="col">${esc(t(lang, "s.col.formula"))}</th><th scope="col">${esc(t(lang, "s.col.marks"))}</th><th scope="col"><span class="sr">${esc(t(lang, "s.col.actions"))}</span></th></tr></thead><tbody>${rows}</tbody></table></div><div class="cards">${cards}</div>`;
}

// ctx.spaceUrl : adresse de l'espace client (ajoutée à l'aide sur les conditions) ; absente = pas de lien.
export function renderSessions(sessions, lang, filter, urlFor = defaultUrl, ctx = {}) {
  const all = Array.isArray(sessions) ? sessions : [];
  if (!all.length) return `<div class="empty"><p>${esc(t(lang, "s.empty"))}</p></div>`;
  const list = filterSessions(all, filter);
  const cancelled = filter === "all" ? all.filter((s) => sessionView(s, lang).bucket === "annulees") : [];
  let html = list.length ? listBlock(list, lang, urlFor, ctx) : `<div class="empty"><p>${esc(t(lang, "s.emptyFilter"))}</p></div>`;
  if (cancelled.length) html += `<details class="cancelled"><summary>${esc(t(lang, "s.cancelledN", { n: cancelled.length }))}</summary>${listBlock(cancelled, lang, urlFor, ctx)}</details>`;
  return html;
}

// Un lien par ligne (ou séparé par des blancs ; une virgule ou un point-virgule fait partie du lien) → liste de liens complétés ; bad = au moins un texte invalide.
export function parseLinks(text) {
  const parts = String(text || "").split(/\s+/).map((x) => normalizeLink(x)).filter(Boolean);
  const good = [], bad = [];
  for (const p of parts) (isHttpUrl(p) && p.length <= 1000 ? good : bad).push(p);
  return { links: good, bad };
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* repli ci-dessous */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  } catch { return false; }
}


// Enregistrer des rushes lance-t-il la commande ? Oui si le brief est déjà envoyé (ou n'a aucune question).
export const startsOrder = (s) => !!(s.brief && s.brief.submitted_at) || s.questions === 0;
