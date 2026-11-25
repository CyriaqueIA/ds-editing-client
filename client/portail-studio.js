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

/* Mode « studio autonome » (contrat §10) : le studio garde ses monteurs, aucune commande. */
Object.assign(T.fr, {
    "st.brief_recu": "Brief reçu",
    "st.terminee": "Classée",
    "s.t.done.studio": "Classées",
    "s.t.done.mixed": "Livrées ou classées",
    "step.files": "Fichiers",
    "step.filed": "Classée",
    "s.files.open": "Ouvrir les fichiers",
    "s.files.copying": "Copie des fichiers en cours…",
    "s.files.slow": "La copie des fichiers prend plus de temps que prévu. Elle reprend toute seule ; si cela dure, prévenez votre contact habituel.",
    "s.done": "Classer",
    "s.done.title": "Classer cette session ?",
    "s.done.text": "Elle passe dans les sessions classées et ne pourra plus être modifiée ni annulée.",
    "s.done.copying": "La copie des fichiers continue.",
    "s.done.yes": "Oui, classer la session",
    "s.done.no": "Non, pas maintenant",
    "s.cancel.files": "Les fichiers qui ne sont pas encore copiés ne le seront plus.",
    "s.locked.studio": "Cette session est déjà classée ou annulée, elle ne peut plus être modifiée.",
    "s.e.done_not_studio": "Cette session ne peut pas être classée.",
    "s.e.done_no_brief": "Le client n'a pas encore envoyé son brief. Classez la session une fois le brief reçu.",
    "s.e.patch_invalid": "Cette action n'a pas pu être enregistrée. Rechargez la page et réessayez.",
    "s.e.action": "L'action n'a pas abouti. Réessayez dans un instant.",
    "s.addNote": "Ajouter des liens pour vos monteurs",
    "s.editNote": "Modifier les liens pour vos monteurs",
    "s.note.title": "Liens pour vos monteurs",
    "s.note.help": "Facultatif. Un lien par ligne (Drive, Dropbox, WeTransfer…). Ils restent dans cette session, pour vos monteurs.",
    "s.brief.copy": "Copier le brief",
    "s.n.rushesStudio": "Liens pour vos monteurs (facultatif)",
    "s.n.rushesHelpStudio": "Ils restent dans cette session. Vous pourrez les ajouter plus tard.",
    "s.n.emailHelpStudio": "L'adresse de votre studio.",
    "s.n.termsSome": "Les autres formules s'ouvriront quand vous aurez accepté les conditions dans votre espace client.",
});
Object.assign(T.en, {
    "st.brief_recu": "Brief received",
    "st.terminee": "Done",
    "s.t.done.studio": "Done",
    "s.t.done.mixed": "Delivered or done",
    "step.files": "Files",
    "step.filed": "Done",
    "s.files.open": "Open the files",
    "s.files.copying": "Copying the files…",
    "s.files.slow": "Copying the files is taking longer than expected. It retries on its own; if it lasts, tell your usual contact.",
    "s.done": "Mark as done",
    "s.done.title": "Mark this session as done?",
    "s.done.text": "It moves to Done and can no longer be changed or cancelled.",
    "s.done.copying": "Copying the files continues.",
    "s.done.yes": "Yes, mark it as done",
    "s.done.no": "Not now",
    "s.cancel.files": "Files that are not copied yet will no longer be copied.",
    "s.locked.studio": "This session is already done or cancelled and can no longer be changed.",
    "s.e.done_not_studio": "This session cannot be marked as done.",
    "s.e.done_no_brief": "The client has not sent the brief yet. Mark the session as done once the brief is in.",
    "s.e.patch_invalid": "This action could not be saved. Reload the page and try again.",
    "s.e.action": "The action did not go through. Please try again in a moment.",
    "s.addNote": "Add links for your editors",
    "s.editNote": "Edit the links for your editors",
    "s.note.title": "Links for your editors",
    "s.note.help": "Optional. One link per line (Drive, Dropbox, WeTransfer…). They stay in this session, for your editors.",
    "s.brief.copy": "Copy the brief",
    "s.n.rushesStudio": "Links for your editors (optional)",
    "s.n.rushesHelpStudio": "They stay in this session. You can add them later.",
    "s.n.emailHelpStudio": "Your studio's address.",
    "s.n.termsSome": "The other packages open once you have accepted the terms in your client space.",
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
export const STATUSES = ["rush_attendu", "brief_attendu", "commande_en_attente", "a_traiter", "en_montage", "controle", "livre", "annulee", "brief_recu", "terminee"];
export const statusLabel = (s, lang) => (STATUSES.includes(s) ? t(lang, "st." + s) : String(s || ""));

export function deliverablesText(list, lang) {
  return (Array.isArray(list) ? list : []).map((d) => `${Number(d.qty) || 0} × ${lang === "en" ? d.label_en || d.label_fr || d.key : d.label_fr || d.label_en || d.key}`).join(" · ");
}

/* Mode « studio autonome » (§10) : session sans commande. Une base pas encore migrée n'envoie ni `mode` ni les nouveaux états :
   la session est alors une session « ds », comme avant. Les deux états propres au mode autonome le désignent aussi. */
export const isStudio = (s) => !!s && (s.mode ? s.mode === "studio" : s.status === "brief_recu" || s.status === "terminee");   // `mode` prime quand la base le donne
const studioStatus = (s) => {
  if (["annulee", "terminee", "brief_recu", "brief_attendu"].includes(s.status)) return s.status;
  return s.cancelled_at ? "annulee" : s.done_at ? "terminee" : s.brief && s.brief.submitted_at ? "brief_recu" : "brief_attendu";
};
// Adresse du dossier de fichiers : https seulement, hôte drive.google.com (le moteur ne produit que des liens https://drive.google.com/drive/folders/<id>),
// sans espace, 12 à 1000 caractères ; sinon "" (aucun lien).
export function safeFilesUrl(u) {
  if (typeof u !== "string") return "";
  const v = u.trim();
  if (v.length < 12 || v.length > 1000 || /\s/.test(v) || !/^https:\/\//i.test(v)) return "";
  try { const u = new URL(v); return u.protocol === "https:" && u.hostname === "drive.google.com" && !u.username && !u.password ? v : ""; } catch { return ""; }
}
// Fichiers du brief : { url } si le lien est posé (même sur une session annulée : le dossier existe toujours) ; { copying: true } si la copie est en cours,
// avec slow: true pour `erreur` (jamais d'erreur brute : « ça prend plus de temps que prévu ») ; sinon null. Rien ne se déduit de files_count.
export function filesInfo(s) {
  if (!isStudio(s)) return null;
  const url = safeFilesUrl(s.files_folder_url);
  if (url) return { url };
  if (s.cancelled_at || s.status === "annulee") return null;
  if (s.files_state === "erreur") return { copying: true, slow: true };
  if (s.files_state === "copie_en_cours") return { copying: true };
  return null;
}

// Une session se modifie (rushes, annulation) tant que la commande n'existe pas et qu'elle n'est pas annulée ; en mode autonome, tant qu'elle n'est pas classée.
export const canEdit = (s) => !s.purged_at && !s.order && !s.cancelled_at && s.status !== "annulee" && !(isStudio(s) && (s.done_at || s.status === "terminee"));

/* sessionView : tout ce que la liste affiche d'une session se calcule ici, à partir de l'objet session du contrat (§7.4).
   La PREMIÈRE règle vraie gagne. */
export const BUCKETS = ["all", "a_vous", "client", "montage", "livrees"];
const STEP_KEYS = ["created", "rushes", "brief", "edit", "done"];
function baseView(s, lang) {
  if (isStudio(s)) return studioView(s, lang);
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

/* Session autonome : 4 états (§10.5), jamais de commande ni de rushes obligatoires. */
function studioView(s, lang) {
  const st = studioStatus(s), briefDone = !!(s.brief && s.brief.submitted_at) || s.questions === 0 || st === "brief_recu" || st === "terminee";
  const P = (key, tone) => ({ label: t(lang, key), tone });
  const N = (action, key) => ({ action, label: t(lang, key) });
  let bucket, pill, next;
  if (st === "annulee") { bucket = "annulees"; pill = P("st.annulee", "off"); next = null; }
  else if (st === "terminee") { bucket = "livrees"; pill = P("st.terminee", "ok"); next = N("view", "s.viewBrief"); }
  else if (st === "brief_recu") { bucket = "a_vous"; pill = P("st.brief_recu", "todo"); next = N("view", "s.viewBrief"); }
  else { bucket = "client"; pill = P("st.brief_attendu", "wait"); next = N("copy", "s.copyLink"); }
  const cancelled = bucket === "annulees", filed = st === "terminee", fi = filesInfo(s);
  const flags = { created: "done", brief: briefDone ? "done" : "wait", files: !briefDone ? "todo" : fi && fi.copying ? "wait" : "done", filed: filed ? "done" : "todo" };
  const steps = cancelled ? [] : ["created", "brief", "files", "filed"].map((key) => ({ key, label: t(lang, "step." + key), state: flags[key] }));
  return { bucket, pill, next, steps, done: steps.filter((x) => x.state === "done").length, total: steps.length, missing: cancelled || briefDone ? null : "brief", hint: null, studio: true, files: fi };
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
  const live = (Array.isArray(sessions) ? sessions : []).filter((s) => sessionView(s, "fr").bucket !== "annulees");
  const nStudio = live.filter(isStudio).length;
  const key = (b) => (b === "livrees" && nStudio ? (nStudio === live.length ? "s.t.done.studio" : "s.t.done.mixed") : TILE_KEY[b]);   // « Livrées » devient « Classées » quand il n'y a que des sessions autonomes
  const onlyStudio = live.length > 0 && nStudio === live.length;   // « En montage » resterait à 0 pour toujours : on la retire
  return BUCKETS.filter((b) => !(onlyStudio && b === "montage")).map((b) => `<button type="button" class="tile${b === "a_vous" && c.a_vous > 0 ? " hot" : ""}" data-f="${b}" aria-pressed="${filter === b}"><span class="tile-n">${c[b]}</span><span class="tile-l">${esc(t(lang, key(b)))}</span></button>`).join("");
}

function stepsHtml(v, lang) {
  if (!v.total) return "";
  const stateTxt = (x) => t(lang, "step.s." + x);
  const aria = t(lang, "s.stepsAria", { list: v.steps.map((x) => `${x.label} (${stateTxt(x.state)})`).join(", ") });
  const miss = v.missing ? `<p class="miss">${esc(t(lang, "s.miss." + v.missing))}</p>` : "";
  return `<div class="steps"><div class="seg-bar${v.steps.length === 4 ? " n4" : ""}" role="img" aria-label="${esc(aria)}">${v.steps.map((x) => `<i class="seg ${x.state}"></i>`).join("")}</div><p class="steps-t">${esc(t(lang, v.done === 1 ? "s.stepsOne" : "s.steps", { n: v.done, total: v.total }))}</p>${miss}</div>`;
}

// Ligne des fichiers (mode autonome) : lien « Ouvrir les fichiers » (nouvel onglet) ou « Copie des fichiers en cours… ». Rien sinon.
function filesHtml(v, lang) {
  const f = v.files; if (!f) return "";
  if (f.url) return `<p class="files"><a class="link" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(t(lang, "s.files.open"))}</a></p>`;
  return `<p class="files wait">${esc(t(lang, f.slow ? "s.files.slow" : "s.files.copying"))}</p>`;
}

const defaultUrl = (token) => { try { return briefUrl(token); } catch { return ""; } };
function actionsHtml(s, v, lang, urlFor) {
  if (v.purged) return "";   // session vidée : ni lien de brief, ni fichiers, ni relance
  const id = esc(s.id);
  const btn = (act, label, cls) => `<button type="button" class="${cls}" data-act="${act}" data-id="${id}">${esc(label)}</button>`;
  const out = [];
  if (v.next) out.push(btn(v.next.action, v.next.label, "btn primary small"));
  const studio = !!v.studio;
  if (studio && s.status === "brief_recu" && !s.cancelled_at && !s.done_at) out.push(btn("done", t(lang, "s.done"), "btn small"));
  const sec = [];
  const skip = v.next && v.next.action;
  const cancelled = v.bucket === "annulees";
  if (!cancelled && skip !== "copy" && !(studio && s.status === "terminee")) sec.push(btn("copy", t(lang, "s.copyLink"), "link"));
  if (canEdit(s) && skip !== "rushes") sec.push(btn("rushes", t(lang, studio ? (s.has_rushes ? "s.editNote" : "s.addNote") : s.has_rushes ? "s.editRushes" : "s.addRushes"), "link"));
  if (skip !== "view") sec.push(btn("view", t(lang, "s.viewBrief"), "link"));
  if (v.canRemind && skip !== "remind") sec.push(btn("remind", t(lang, "rem.btn"), "link"));
  if (!cancelled && !(s.brief && s.brief.submitted_at)) { const u = urlFor(s.token); if (u && /^https?:\/\//i.test(u)) sec.push(`<a class="link" href="${esc(u)}" target="_blank" rel="noopener">${esc(t(lang, "s.fillFor"))}</a>`); }
  if (canEdit(s)) sec.push(btn("cancel", t(lang, "s.cancelSession"), "link danger"));
  return `<div class="acts">${out.join("")}${sec.length ? `<div class="sec">${sec.join("")}</div>` : ""}</div>`;
}

function listBlock(list, lang, urlFor, ctx = {}) {
  const formula = (s) => {
    const name = loc(s.formula && s.formula.name, lang), d = deliverablesText(s.deliverables, lang);
    return `<strong>${esc(name)}</strong>` + (d ? `<span class="sub">${esc(d)}</span>` : "");
  };
  const who = (s) => `<strong>${esc(s.title)}</strong><span class="sub">${esc(s.client_name)}${s.session_date ? " · " + esc(t(lang, "s.shoot", { date: fmtDate(s.session_date, lang) })) : ""}</span>` + (s.order && s.order.token && !s.purged_at ? `<span class="sub">${esc(t(lang, "s.order", { n: s.order.token }))}</span>` : "");
  const hintHtml = (v) => (v.hint ? `<p class="hint">${esc(v.hint)}${v.bucket === "a_vous" && ctx.spaceUrl ? ` <a href="${esc(ctx.spaceUrl)}" target="_blank" rel="noopener">${esc(t(lang, "s.hint.space"))}</a>` : ""}</p>` : "");
  const prog = (v) => `<span class="pill-st st-${v.pill.tone}">${esc(v.pill.label)}</span>${hintHtml(v)}${filesHtml(v, lang)}${extrasHtml(v)}${stepsHtml(v, lang)}`;
  const rows = list.map((s) => { const v = sessionView(s, lang); return `<tr data-id="${esc(s.id)}"${v.purged ? ' class="purged"' : ""}><td class="c-main">${who(s)}</td><td>${formula(s)}</td><td class="c-prog">${prog(v)}</td><td>${actionsHtml(s, v, lang, urlFor)}</td></tr>`; }).join("");
  const cards = list.map((s) => { const v = sessionView(s, lang); return `<article class="scard${v.purged ? " purged" : ""}" data-id="${esc(s.id)}"><div class="scard-h"><div>${who(s)}</div><span class="pill-st st-${v.pill.tone}">${esc(v.pill.label)}</span></div>${hintHtml(v)}<p class="scard-f">${formula(s)}</p>${filesHtml(v, lang)}${extrasHtml(v)}${stepsHtml(v, lang)}${actionsHtml(s, v, lang, urlFor)}</article>`; }).join("");
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

/* =====================================================================================================================
   Brique 4 et 5 : abonnement, bilan du mois, relances, durée de garde (contrats portail_abonnement_v1 et portail_brief_v1 §11).
   Règle d'or : si la base n'est pas à jour (fonction absente, clé absente), RIEN de nouveau n'apparaît.
   Tout ce que la page lit du contrat passe par CONTRACT et les trois fonctions norm* : un changement de nom ou de format
   se corrige ICI, à un seul endroit. Le reste du code ne lit que la forme normalisée.
   ===================================================================================================================== */
// Arguments de l'acceptation : version ET prix AFFICHÉS (la base refuse si l'un des deux a changé : version_obsolete, price_changed).
// Ce que le bloc dessiné montre (version et prix) : c'est la seule chose envoyée à l'acceptation.
export const shownAsk = (sub) => ({ terms: { version: sub.terms.version }, price: sub.price });
export const acceptArgs = (sub) => ({ p_version: sub.terms.version, p_price: sub.price });
export const CONTRACT = {
  fn: { subGet: "portal_subscription_get", subAccept: "portal_subscription_accept", report: "portal_month_report", remind: "portal_session_remind" },
  err: { notWaiting: "not_waiting", badKey: "bad_key", obsolete: "version_obsolete", noSub: "no_subscription", stopped: "subscription_stopped", noTerms: "no_terms", noPrice: "no_price", priceInvalid: "price_invalide", priceChanged: "price_changed", monthBad: ["month_invalide", "month_futur"] },
  states: ["essai", "actif", "arrete"],
  report: ["sessions_created", "briefs_received", "briefs_waiting", "median_brief_hours", "files_received", "orders_created", "orders_delivered", "sessions_done"],
};
const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
const numOrNull = (x) => (typeof x === "number" && Number.isFinite(x) ? x : null);
const strOrNull = (x) => (typeof x === "string" && x.trim() ? x : null);

// Réponse de portal_subscription_get → forme interne, ou null (rien à afficher).
// ask_reason rendu par la base → cause interne (une seule table à corriger si un nom change)
const ASK_REASONS = { first: "first", terms: "version", price_up: "price", resume: "resume", after_free: "afterFree" };
export function normSub(raw) {
  if (!isObj(raw) || !isObj(raw.subscription) || !CONTRACT.states.includes(raw.subscription.state)) return null;
  const s = raw.subscription, ter = isObj(raw.terms) && strOrNull(raw.terms.version) && isObj(raw.terms.text) ? { version: raw.terms.version, text: raw.terms.text } : null;
  const acc = isObj(raw.accepted) ? { version: raw.accepted.version, at: strOrNull(raw.accepted.accepted_at), price: numOrNull(raw.accepted.price), current: raw.accepted.current === true } : null;   // price : dernier prix ACCEPTÉ (null avec la clé interne)
  return {
    state: s.state, trialStart: strOrNull(s.trial_start), trialEnd: strOrNull(s.trial_end), trialActive: s.trial_active !== false,
    billedKnown: "billed_price" in s, billed: numOrNull(typeof s.billed_price === "string" ? parseFloat(s.billed_price) : s.billed_price),   // prix réellement facturé ce mois-ci ; null = rien ne sera facturé (ou clé interne)
    askReason: ASK_REASONS[s.ask_reason] || null, askPriceFrom: strOrNull(s.ask_price_from),   // pourquoi la base demande d'accepter, et la date à partir de laquelle le prix à accepter s'appliquerait (null avec la clé interne)
    nextPrice: numOrNull(typeof s.next_price === "string" ? parseFloat(s.next_price) : s.next_price), nextPriceFrom: strOrNull(s.next_price_from),   // hausse acceptée en cours de mois : vaut à partir de la période suivante (null sinon, et avec la clé interne)
    free: s.free === true || s.monthly_price === 0,                                                                    // studio gratuit : « Portail offert », rien à accepter
    price: numOrNull(typeof s.monthly_price === "string" ? parseFloat(s.monthly_price) : s.monthly_price),   // null = pas fixé, ou clé interne : jamais affiché
    nextEnd: strOrNull(s.next_billing), stoppedAt: strOrNull(s.stopped_at),   // next_billing = lendemain de la fin de la période en cours (contrat 4.2) : la période finit la veille
    terms: ter, accepted: acc, needsAcceptance: raw.needs_acceptance === true, internal: raw.internal === true,
    currency: isObj(raw.studio) ? raw.studio.currency : "",
  };
}
// Réponse de portal_month_report → forme interne, ou null (la section n'existe pas).
export function normReport(raw) {
  if (!isObj(raw) || !isObj(raw.current) || !strOrNull(raw.month)) return null;
  const per = (o) => (isObj(o) ? Object.fromEntries(CONTRACT.report.map((k) => [k, numOrNull(o[k])])) : null);
  return { month: raw.month, prevMonth: strOrNull(raw.previous_month), cur: per(raw.current), prev: per(raw.previous) };
}
// Clés nouvelles d'une session. `has` faux = base pas à jour : aucune nouveauté à l'écran.
export function sessionExtra(s) {
  const has = typeof s.to_remind === "boolean", n = Number(s.nudge_count);
  const waiting = has && !(s.brief && s.brief.submitted_at) && !s.cancelled_at && !s.done_at && !s.purged_at && !s.order && s.status !== "annulee";
  return { has, waiting, toRemind: waiting && s.to_remind === true, days: numOrNull(s.waiting_days), nudgedAt: strOrNull(s.nudged_at), nudges: Number.isFinite(n) && n > 0 ? Math.floor(n) : 0, keepUntil: strOrNull(s.keep_until), purgedAt: strOrNull(s.purged_at), purgedFiles: numOrNull(s.files_count) };
}

/* ---------- dates et nombres ---------- */
const pad = (n) => String(n).padStart(2, "0");
function ymd(v) {   // « AAAA-MM-JJ » tel quel (jour sans fuseau) ; un horodatage → jour local du navigateur
  if (typeof v !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); if (m) return [m[3], m[2], m[1]];
  const d = new Date(v); return isNaN(d) ? null : [pad(d.getDate()), pad(d.getMonth() + 1), String(d.getFullYear())];
}
export function dateText(v, lang) {   // date lisible dans les deux langues (« 5 December 2026 »), jamais « 05/12 » ambigu
  const x = ymd(v); if (!x) return "";
  const out = fmtDate(`${x[2]}-${x[1]}-${x[0]}`, lang);
  return lang === "en" ? out : out.replace(/^1 /, "1er ");   // « 1er décembre » en français
}
const nf = (n, lang, max = 1) => new Intl.NumberFormat(lang === "en" ? "en-GB" : "fr-FR", { maximumFractionDigits: max }).format(n);
export function fmtPrice(n, currency, lang) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "";
  const cur = /^[A-Z]{3}$/.test(currency || "") ? currency : "";
  if (cur) { try { return new Intl.NumberFormat(lang === "en" ? "en-GB" : "fr-FR", { style: "currency", currency: cur }).format(n); } catch { /* repli */ } }
  return nf(n, lang, 2) + (cur ? " " + cur : "");
}
export function fmtDelay(hours, lang) {   // heures sous 48 h, jours au-delà
  if (typeof hours !== "number" || !Number.isFinite(hours) || hours < 0) return "";
  if (hours < 1) return t(lang, "bil.lessHour");
  return hours >= 48 ? t(lang, "bil.days", { n: nf(hours / 24, lang) }) : t(lang, "bil.hours", { n: nf(hours, lang) });
}
export function monthLabel(m, lang) {
  const x = /^(\d{4})-(\d{2})$/.exec(String(m || "")); if (!x) return "";
  try { return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(+x[1], +x[2] - 1, 1))); } catch { return String(m); }
}

/* ---------- abonnement ---------- */
// Prix écrit sur la ligne d'état : le prix réellement FACTURÉ (billed_price), jamais un prix réglé que le studio n'a pas encore accepté.
// Mois offert sans acceptation : le prix qu'il va devoir accepter. Clé interne : aucun prix.
export function linePrice(sub) {
  if (!sub || sub.free) return null;
  if (sub.billedKnown) return sub.billed !== null ? sub.billed : sub.state === "essai" && !sub.accepted ? sub.price : null;
  return sub.accepted ? sub.accepted.price : sub.state === "essai" ? sub.price : null;
}
export function aboParts(sub, lang, opts = {}) {
  if (!sub) return [];
  const price = fmtPrice(linePrice(sub), sub.currency, lang), out = [];
  if (sub.free) return [t(lang, "ab.free")];
  if (sub.state === "arrete") {
    out.push(sub.stoppedAt && dateText(sub.stoppedAt, lang) ? t(lang, "ab.stoppedOn", { date: dateText(sub.stoppedAt, lang) }) : t(lang, "ab.stopped"));
    return out;
  }
  if (sub.state === "essai") {   // mois offert, à venir, ou fini en attendant le passage du moteur (l'état reste « essai » au plus un jour)
    const d = dateText(sub.trialEnd, lang), from = dateText(sub.trialStart, lang);
    // trial_active vient de la base (jour de Bali) : sans lui on ne devine pas si le mois offert est à venir ou fini : on écrit ses dates, sans « terminé » ni « à venir »
    out.push(!d ? t(lang, "ab.trialOn") : sub.trialActive ? t(lang, "ab.trial", { date: d }) : from ? t(lang, "ab.trialRange", { from, date: d }) : t(lang, "ab.trial", { date: d }));
    if (price) out.push(t(lang, "ab.then", { price }));
  } else {
    out.push(t(lang, "ab.active"));
    const np = fmtPrice(sub.nextPrice, sub.currency, lang), npFrom = dateText(sub.nextPriceFrom, lang);
    if (price && np && npFrom) { out.push(t(lang, "ab.thisMonth", { price }), t(lang, "ab.nextPrice", { price: np, date: npFrom })); }   // hausse acceptée : ce mois-ci l'ancien prix, puis le nouveau
    else {
      if (price) out.push(t(lang, "ab.price", { price }));
      const owed = sub.needsAcceptance && ["resume", "afterFree"].includes(askKind(sub)), endYmd = owed ? null : dayBefore(sub.nextEnd), end = endYmd ? dateText(endYmd, lang) : "";   // next_billing = lendemain de la fin de période ; pendant une reprise il peut désigner l'ancienne période encore due : ce n'est pas « le mois en cours »
      if (end) out.push(t(lang, "ab.cur", { date: end }));
      const billed = linePrice(sub); if (canAccept(sub) && billed !== null && sub.price > billed) out.push(t(lang, "ab.newPrice"));   // seulement une HAUSSE en attente (pas une reprise ni un changement de texte)
    }
  }
  if (sub.accepted && sub.accepted.current && !sub.needsAcceptance && !opts.done && dateText(sub.accepted.at, lang)) out.push(t(lang, "ab.accepted", { date: dateText(sub.accepted.at, lang) }));
  return out;
}
export function dayBefore(v) {   // « AAAA-MM-JJ » → la veille (jour sans fuseau)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || "")); if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] - 1)).toISOString().slice(0, 10);
}
// Pourquoi la base demande d'accepter (elle ne le dit pas, on le déduit de ce qu'elle rend) :
// "first" jamais accepté · "version" le texte a changé · "price" hausse du prix seule · "resume" reprise après un arrêt (rien d'autre n'a changé).
export function askKind(sub) {
  if (sub && sub.askReason) return sub.askReason;   // la base le DIT (ask_reason) : on s'y fie
  const a = sub && sub.accepted;   // repli seulement si le champ manque (base plus ancienne) : déduction
  if (!a || !a.at) return "first";
  if (sub.terms && a.version !== sub.terms.version) return "version";
  if (a.price !== null && sub.price !== null && sub.price > a.price) return "price";
  return sub.internal ? "first" : "resume";   // la clé interne ne voit aucun prix : on ne peut pas distinguer, titre neutre
}
// La date du prix à accepter est-elle À VENIR ? Sans l'heure du navigateur, d'après les champs de la base :
// mois offert en cours ou état « essai » : le 1er jour payant est à venir ; sinon la base ne rend une date à venir que pour la période SUIVANTE, qui commence à next_billing ;
// sans next_billing (rien n'est facturé encore : première acceptation après le mois offert, après une période gratuite) : le début du mois en cours, déjà passé.
export function askFuture(sub) {
  if (!sub || !sub.askPriceFrom) return false;
  if (sub.trialActive || sub.state === "essai") return true;
  if (sub.nextEnd) return sub.askPriceFrom >= sub.nextEnd;
  return false;
}
export const termsText = (sub, lang) => (sub && sub.terms ? loc(sub.terms.text, lang) : "");
// L'acceptation est proposée seulement si : à accepter, version courante posée, prix fixé, abonnement pas arrêté.
export const canAccept = (sub) => !!sub && sub.needsAcceptance && !!sub.terms && sub.price !== null && sub.state !== "arrete" && !sub.internal && !sub.free;
// Prix pas encore fixé (la base rend alors needs_acceptance faux) : rien à accepter, on le dit une fois, tant que rien n'a jamais été accepté.
export const needsPrep = (sub) => !!sub && !sub.internal && !sub.free && !!sub.terms && sub.price === null && sub.state !== "arrete" && !sub.accepted;
/* ligne d'état + bloc des conditions. opts.done = date d'une acceptation faite dans cette page. */
export function aboHtml(sub, lang, opts = {}) {
  if (!sub) return "";
  const parts = aboParts(sub, lang, opts);
  let h = `<p class="abo-line">${esc(parts.join(" · "))}</p>`;
  if (opts.done && !sub.needsAcceptance) h += `<p class="abo-ok" role="status">${esc(t(lang, "ab.terms.done", { date: dateText(opts.done, lang) || opts.done }))}</p>`;
  if (sub.free) return h;
  if (needsPrep(sub)) return h + `<section class="card abo-card" aria-labelledby="ab-h"><h2 id="ab-h">${esc(t(lang, "ab.terms.title"))}</h2><p class="notice" role="status">${esc(t(lang, "ab.prep"))}</p></section>`;
  if (!sub.needsAcceptance || !sub.terms || sub.state === "arrete") return h;
  const price = fmtPrice(sub.price, sub.currency, lang), was = sub.billed !== null ? sub.billed : sub.accepted ? sub.accepted.price : null, before = was !== null && sub.price !== null && was !== sub.price ? fmtPrice(was, sub.currency, lang) : "";   // « avant » = le prix réellement facturé (billed_price), à défaut le dernier accepté
  const kind = askKind(sub), TITLE = { first: "ab.terms.title", version: "ab.terms.titleNew", price: "ab.terms.titlePrice", resume: "ab.terms.titleResume", afterFree: "ab.terms.titleAfterFree" }, INTRO = { first: "ab.terms.intro", version: "ab.terms.intro", price: "ab.terms.introPrice", resume: "ab.terms.introResume", afterFree: "ab.terms.introAfterFree" };
  h += `<section class="card abo-card" aria-labelledby="ab-h"><h2 id="ab-h">${esc(t(lang, TITLE[kind]))}</h2>`;
  if (sub.internal) {   // accès équipe : la base ne rend aucun prix ; on montre le texte, sans montant, sans case ni bouton
    h += `<div class="terms-text" tabindex="0" role="region" aria-label="${esc(t(lang, "ab.terms.box"))}">${esc(termsText(sub, lang))}</div>`;
    return h + `<p class="notice" role="status">${esc(t(lang, "ab.terms.internal"))}</p></section>`;
  }
  if (sub.price === null) return h + `<p class="notice" role="status">${esc(t(lang, "ab.prep"))}</p></section>`;
  h += `<p class="muted">${esc(t(lang, INTRO[kind]))}</p>`;
  h += `<p class="abo-price"><span class="abo-price-l">${esc(t(lang, "ab.terms.priceL"))}</span> <strong>${esc(t(lang, "ab.price", { price }))}</strong>${before ? ` <span class="abo-price-l">(${esc(t(lang, "ab.terms.was", { price: before }))})</span>` : ""}</p>`;
  // La base donne la date (ask_price_from). Aucune phrase de date quand seul le TEXTE change (le prix ne change pas, ou baisse : la baisse vaut déjà ce mois-ci).
  if (kind !== "version" && sub.askPriceFrom && dateText(sub.askPriceFrom, lang)) h += `<p class="muted abo-from">${esc(t(lang, askFuture(sub) ? "ab.terms.from" : "ab.terms.fromNow", { date: dateText(sub.askPriceFrom, lang) }))}</p>`;
  h += `<div class="terms-text" tabindex="0" role="region" aria-label="${esc(t(lang, "ab.terms.box"))}">${esc(termsText(sub, lang))}</div>`;
  return h + `<label class="terms" for="ab-check"><input type="checkbox" id="ab-check"><span>${esc(t(lang, "ab.terms.check", { price }))}</span></label><p class="err" id="ab-err" role="alert"></p><button type="button" class="btn primary" id="ab-accept">${esc(t(lang, "ab.terms.accept"))}</button></section>`;
}

/* ---------- bilan du mois ---------- */
// rep : forme interne ; state : { which: "cur" | "prev", err: bool }
export function reportBody(rep, lang, state = {}) {
  if (!rep) return "";
  const hasPrev = !!rep.prev;
  const radios = rep.prevMonth ? `<div class="pills" role="radiogroup" aria-label="${esc(t(lang, "bil.pick"))}">${["cur", "prev"].map((w) => `<label class="pill"><input type="radio" name="bm" value="${w}"${(state.which || "cur") === w ? " checked" : ""}><span>${esc(t(lang, "bil." + w))}</span></label>`).join("")}</div>` : "";
  const fig = (k) => {
    const v = rep.cur[k], p = rep.prev ? rep.prev[k] : null, show = (x) => (x === null ? "—" : k === "median_brief_hours" ? fmtDelay(x, lang) || "—" : nf(x, lang, 0));
    return `<div class="fig"><dt>${esc(t(lang, "bil." + k))}</dt><dd class="fig-n">${esc(show(v))}</dd>${hasPrev ? `<dd class="fig-p">${esc(t(lang, "bil.before", { value: show(p) }))}</dd>` : ""}</div>`;
  };
  const cmp = hasPrev && rep.prevMonth ? ` · ${t(lang, "bil.vs", { month: monthLabel(rep.prevMonth, lang) })}` : "";
  return `${radios}<p class="bil-month">${esc(monthLabel(rep.month, lang) + cmp)}</p>${state.err ? `<p class="err" role="alert">${esc(t(lang, "bil.err"))}</p>` : ""}<dl class="figs">${CONTRACT.report.map(fig).join("")}</dl><p class="help">${esc(t(lang, "bil.help"))}</p>`;
}

/* ---------- relances ---------- */
export function remindMessage(s, link) {
  const l = s.lang === "en" ? "en" : "fr";
  return t(l, "rem.msg", { name: s.client_name || "", link });
}
export const remindSubject = (s) => t(s.lang === "en" ? "en" : "fr", "rem.subject");
export const waUrl = (text) => "https://wa.me/?text=" + encodeURIComponent(text);
export function mailtoUrl(email, subject, body) {
  const to = typeof email === "string" && /^[^\s@,;<>?&=]+@[^\s@,;<>?&=]+\.[^\s@,;<>?&=]+$/.test(email) ? email : "";
  return `mailto:${to.split("@").map(encodeURIComponent).join("@")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(String(body).replace(/\r?\n/g, "\r\n"))}`;
}
export function remindedText(s, lang) {
  const x = sessionExtra(s); if (!x.nudges || !dateText(x.nudgedAt, lang)) return "";
  return t(lang, x.nudges === 1 ? "rem.sentOne" : "rem.sent", { date: dateText(x.nudgedAt, lang), n: x.nudges });
}

/* ---------- vue d'une session : base + relance, garde, vidée ---------- */
export function sessionView(s, lang) {
  const v = baseView(s, lang), x = sessionExtra(s);
  if (x.purgedAt) {   // vidée : même bucket que son état d'origine, mais aucune donnée, aucune action
    const d = dateText(x.purgedAt, lang), lines = [d ? t(lang, "purged.on", { date: d }) : t(lang, "purged.pill")];
    if (x.purgedFiles) lines.push(t(lang, x.purgedFiles === 1 ? "purged.filesOne" : "purged.files", { n: x.purgedFiles }));
    return { ...v, pill: { label: t(lang, "purged.pill"), tone: "off" }, next: null, steps: [], done: 0, total: 0, missing: null, hint: null, files: null, purged: true, canRemind: false, extras: [{ cls: "purged-l", text: lines.join(" · ") }] };
  }
  const extras = [];
  if (x.toRemind) extras.push({ cls: "rem-l", pill: t(lang, "rem.pill"), text: x.days === null ? "" : x.days === 0 ? t(lang, "rem.days0") : x.days === 1 ? t(lang, "rem.days1") : t(lang, "rem.days", { n: x.days }) });
  const nd = remindedText(s, lang); if (nd) extras.push({ cls: "nudged-l", text: nd });
  if (x.keepUntil && dateText(x.keepUntil, lang)) extras.push({ cls: "keep-l", text: t(lang, "keep.until", { date: dateText(x.keepUntil, lang) }) });
  let next = v.next;
  if (x.toRemind && next && next.action === "copy") next = { action: "remind", label: t(lang, "rem.btn") };   // le lien se copie toujours, en second
  return { ...v, next, extras, canRemind: x.waiting };
}
function extrasHtml(v) {
  return (v.extras || []).map((e) => `<p class="${e.cls}">${e.pill ? `<span class="pill-st st-wait">${esc(e.pill)}</span> ` : ""}${esc(e.text)}</p>`).join("");
}

Object.assign(T.fr, {
    "ab.trial": "Mois offert jusqu'au {date}",
    "ab.trialOn": "Mois offert en cours",
    "ab.trialRange": "Mois offert du {from} au {date}",
    "ab.then": "ensuite {price} TTC par mois, facturé à la fin de chaque mois",
    "ab.free": "Portail offert",
    "ab.newPrice": "nouveau prix à accepter ci-dessous",
    "ab.e.price_changed": "Le prix vient de changer. Relisez, puis acceptez.",
    "ab.cur": "mois en cours : jusqu'au {date}",
    "ab.thisMonth": "{price} TTC ce mois-ci",
    "ab.nextPrice": "{price} TTC à partir du {date}",
    "ab.terms.from": "Ce prix s'appliquera à partir du {date}.",
    "ab.terms.fromNow": "Ce prix s'applique dès le mois en cours, commencé le {date}. Ce mois est dû en entier.",
    "ab.terms.titleAfterFree": "Votre abonnement redevient payant",
    "ab.terms.introAfterFree": "Votre abonnement redevient payant. Relisez les conditions et le prix, puis acceptez. Sans engagement, facturé à la fin de chaque mois.",
    "ab.terms.was": "avant : {price} TTC",
    "ab.price": "{price} TTC par mois",
    "ab.active": "Abonnement actif",
    "ab.stopped": "Abonnement arrêté",
    "ab.stoppedOn": "Abonnement arrêté le {date}",
    "ab.accepted": "Conditions acceptées le {date}",
    "ab.prep": "Votre abonnement est en cours de préparation. Vous pourrez accepter les conditions ici dès qu'il sera prêt.",
    "ab.terms.title": "Conditions de l'abonnement",
    "ab.terms.titleNew": "Les conditions de l'abonnement ont changé",
    "ab.terms.titlePrice": "Le prix de votre abonnement a changé",
    "ab.terms.titleResume": "Votre abonnement reprend",
    "ab.terms.introPrice": "Une baisse de prix s'applique tout de suite. Une hausse s'applique après votre accord, à la date indiquée. Sans engagement, facturé à la fin de chaque mois. Relisez, puis acceptez.",
    "ab.terms.introResume": "Votre abonnement reprend. Relisez les conditions, puis acceptez. Sans engagement, facturé à la fin de chaque mois.",
    "ab.terms.intro": "Sans engagement. L'abonnement est facturé à la fin de chaque mois. Une baisse de prix s'applique tout de suite. Une hausse s'applique après votre accord, à la date indiquée. Lisez les conditions, puis acceptez-les.",
    "ab.terms.priceL": "Prix que vous acceptez :",
    "ab.terms.box": "Texte des conditions de l'abonnement",
    "ab.terms.check": "J'ai lu et j'accepte les conditions de l'abonnement, au prix de {price} TTC par mois.",
    "ab.terms.accept": "J'accepte",
    "ab.terms.accepting": "Enregistrement…",
    "ab.terms.done": "Merci, conditions acceptées le {date}.",
    "ab.terms.internal": "Vous voyez cette page avec l'accès de l'équipe : seul le studio peut accepter les conditions.",
    "ab.e.check": "Cochez la case pour accepter.",
    "ab.e.version_obsolete": "Les conditions viennent de changer. Relisez-les, puis acceptez.",
    "ab.e.gone": "Impossible d'accepter pour le moment. La page vient d'être actualisée.",
    "ab.e.generic": "L'acceptation n'a pas abouti. Réessayez dans un instant.",
    "bil.title": "Bilan du mois",
    "bil.pick": "Mois affiché",
    "bil.cur": "Mois en cours",
    "bil.prev": "Mois précédent",
    "bil.vs": "comparé à {month}",
    "bil.before": "Mois d'avant : {value}",
    "bil.help": "Les chiffres portent sur les sessions créées pendant le mois choisi, comptées au moment où vous ouvrez cette page.",
    "bil.err": "Impossible d'afficher ce mois pour le moment.",
    "bil.hours": "{n} h",
    "bil.days": "{n} jours",
    "bil.lessHour": "moins d'1 h",
    "bil.sessions_created": "Sessions créées",
    "bil.briefs_received": "Briefs reçus",
    "bil.briefs_waiting": "Briefs en attente",
    "bil.median_brief_hours": "Délai médian pour recevoir un brief",
    "bil.files_received": "Fichiers reçus",
    "bil.orders_created": "Commandes passées",
    "bil.orders_delivered": "Commandes livrées",
    "bil.sessions_done": "Sessions classées",
    "rem.pill": "À relancer",
    "rem.days0": "En attente depuis aujourd'hui",
    "rem.days1": "En attente depuis 1 jour",
    "rem.days": "En attente depuis {n} jours",
    "rem.btn": "Relancer",
    "rem.title": "Relancer le client",
    "rem.intro": "Voici un message prêt à envoyer à votre client, avec le lien de son brief. Vous pouvez le modifier avant de l'envoyer.",
    "rem.label": "Message ({lang})",
    "rem.lang.fr": "français",
    "rem.lang.en": "anglais",
    "rem.copy": "Copier le message",
    "rem.wa": "Ouvrir dans WhatsApp",
    "rem.mail": "Ouvrir dans un e-mail",
    "rem.sentOne": "Relancé le {date} (1 fois)",
    "rem.sent": "Relancé le {date} ({n} fois)",
    "rem.track": "Le message est prêt, mais la relance n'a pas pu être notée sur cette page.",
    "rem.notWaiting": "Votre client a déjà envoyé son brief : inutile de le relancer.",
    "rem.subject": "Rappel : votre brief",
    "rem.msg": "Bonjour {name},\nPetit rappel : nous attendons encore votre brief pour lancer le montage. Il se remplit en quelques minutes, sans compte :\n{link}\nMerci beaucoup.",
    "keep.until": "Brief et fichiers du client gardés jusqu'au {date}",
    "purged.pill": "Vidée",
    "purged.on": "Vidée le {date}",
    "purged.filesOne": "1 fichier supprimé",
    "purged.files": "{n} fichiers supprimés",
});
Object.assign(T.en, {
    "ab.trial": "Free month until {date}",
    "ab.trialOn": "Free month in progress",
    "ab.trialRange": "Free month from {from} to {date}",
    "ab.then": "then {price} per month (tax included), billed at the end of each month",
    "ab.free": "Portal included at no charge",
    "ab.newPrice": "new price to accept below",
    "ab.e.price_changed": "The price has just changed. Read it again, then accept.",
    "ab.cur": "current month: until {date}",
    "ab.thisMonth": "{price} this month (tax included)",
    "ab.nextPrice": "{price} from {date} (tax included)",
    "ab.terms.from": "This price applies from {date}.",
    "ab.terms.fromNow": "This price applies to the current month, which started on {date}. This month is due in full.",
    "ab.terms.titleAfterFree": "Your subscription is paid again",
    "ab.terms.introAfterFree": "Your subscription is paid again. Read the terms and the price again, then accept. No commitment, billed at the end of each month.",
    "ab.terms.was": "was {price}",
    "ab.price": "{price} per month (tax included)",
    "ab.active": "Subscription active",
    "ab.stopped": "Subscription stopped",
    "ab.stoppedOn": "Subscription stopped on {date}",
    "ab.accepted": "Terms accepted on {date}",
    "ab.prep": "Your subscription is being prepared. You will be able to accept the terms here as soon as it is ready.",
    "ab.terms.title": "Subscription terms",
    "ab.terms.titleNew": "The subscription terms have changed",
    "ab.terms.titlePrice": "The price of your subscription has changed",
    "ab.terms.titleResume": "Your subscription is resuming",
    "ab.terms.introPrice": "A price decrease applies immediately. An increase applies after you accept, from the date shown. No commitment, billed at the end of each month. Read it again, then accept.",
    "ab.terms.introResume": "Your subscription is resuming. Read the terms again, then accept. No commitment, billed at the end of each month.",
    "ab.terms.intro": "No commitment. The subscription is billed at the end of each month. A price decrease applies immediately. An increase applies after you accept, from the date shown. Read the terms, then accept them.",
    "ab.terms.priceL": "Price you are accepting:",
    "ab.terms.box": "Text of the subscription terms",
    "ab.terms.check": "I have read and accept the subscription terms, at {price} per month (tax included).",
    "ab.terms.accept": "I accept",
    "ab.terms.accepting": "Saving…",
    "ab.terms.done": "Thank you, terms accepted on {date}.",
    "ab.terms.internal": "You are viewing this page with the team's access: only the studio can accept the terms.",
    "ab.e.check": "Tick the box to accept.",
    "ab.e.version_obsolete": "The terms have just changed. Read them again, then accept.",
    "ab.e.gone": "Cannot accept right now. The page has just been refreshed.",
    "ab.e.generic": "The acceptance did not go through. Please try again in a moment.",
    "bil.title": "Monthly report",
    "bil.pick": "Month shown",
    "bil.cur": "Current month",
    "bil.prev": "Previous month",
    "bil.vs": "compared with {month}",
    "bil.before": "Month before: {value}",
    "bil.help": "The figures cover the sessions created during the chosen month, counted when you open this page.",
    "bil.err": "Cannot show this month right now.",
    "bil.hours": "{n} h",
    "bil.days": "{n} days",
    "bil.lessHour": "under 1 h",
    "bil.sessions_created": "Sessions created",
    "bil.briefs_received": "Briefs received",
    "bil.briefs_waiting": "Briefs waiting",
    "bil.median_brief_hours": "Median time to receive a brief",
    "bil.files_received": "Files received",
    "bil.orders_created": "Orders placed",
    "bil.orders_delivered": "Orders delivered",
    "bil.sessions_done": "Sessions marked as done",
    "rem.pill": "To remind",
    "rem.days0": "Waiting since today",
    "rem.days1": "Waiting for 1 day",
    "rem.days": "Waiting for {n} days",
    "rem.btn": "Send a reminder",
    "rem.title": "Remind the client",
    "rem.intro": "Here is a message ready to send to your client, with the link to their brief. You can edit it before sending.",
    "rem.label": "Message ({lang})",
    "rem.lang.fr": "French",
    "rem.lang.en": "English",
    "rem.copy": "Copy the message",
    "rem.wa": "Open in WhatsApp",
    "rem.mail": "Open in an e-mail",
    "rem.sentOne": "Reminded on {date} (1 time)",
    "rem.sent": "Reminded on {date} ({n} times)",
    "rem.track": "The message is ready, but the reminder could not be noted on this page.",
    "rem.notWaiting": "Your client has already sent their brief: no need to remind them.",
    "rem.subject": "Reminder: your brief",
    "rem.msg": "Hi {name},\nA quick reminder: we are still waiting for your brief to get started on the edit. It takes a few minutes and needs no account:\n{link}\nThank you.",
    "keep.until": "Client's brief and files kept until {date}",
    "purged.pill": "Cleared",
    "purged.on": "Cleared on {date}",
    "purged.filesOne": "1 file deleted",
    "purged.files": "{n} files deleted",
});
