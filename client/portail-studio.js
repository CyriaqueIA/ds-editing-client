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
export const canEdit = (s) => !s.order && !s.cancelled_at && s.status !== "annulee" && !(isStudio(s) && (s.done_at || s.status === "terminee"));

/* sessionView : tout ce que la liste affiche d'une session se calcule ici, à partir de l'objet session du contrat (§7.4).
   La PREMIÈRE règle vraie gagne. */
export const BUCKETS = ["all", "a_vous", "client", "montage", "livrees"];
const STEP_KEYS = ["created", "rushes", "brief", "edit", "done"];
export function sessionView(s, lang) {
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
  const prog = (v) => `<span class="pill-st st-${v.pill.tone}">${esc(v.pill.label)}</span>${hintHtml(v)}${filesHtml(v, lang)}${stepsHtml(v, lang)}`;
  const rows = list.map((s) => { const v = sessionView(s, lang); return `<tr data-id="${esc(s.id)}"><td class="c-main">${who(s)}</td><td>${formula(s)}</td><td class="c-prog">${prog(v)}</td><td>${actionsHtml(s, v, lang, urlFor)}</td></tr>`; }).join("");
  const cards = list.map((s) => { const v = sessionView(s, lang); return `<article class="scard" data-id="${esc(s.id)}"><div class="scard-h"><div>${who(s)}</div><span class="pill-st st-${v.pill.tone}">${esc(v.pill.label)}</span></div>${hintHtml(v)}<p class="scard-f">${formula(s)}</p>${filesHtml(v, lang)}${stepsHtml(v, lang)}${actionsHtml(s, v, lang, urlFor)}</article>`; }).join("");
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
