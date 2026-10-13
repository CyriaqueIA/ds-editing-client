/* =========================================================================
   DS Editing — classement des liens de rushes. SOURCE DE VÉRITÉ CÔTÉ SITE.

   Pourquoi ce fichier existe (incident Mediacast, 13/10/2026) : le formulaire
   de dépôt n'exigeait qu'un champ non vide. Une cliente a collé deux dossiers
   Google Drive ET le lien Spotify de son podcast. Le robot a essayé six fois
   de télécharger une page web, a abandonné, le tableau de bord est passé au
   rouge, et 156 Go de rushes ont fini à la corbeille, pris pour du déchet.
   Le verrou utile est ici, AVANT l'envoi : ce lien-là ne doit pas pouvoir
   être validé comme un lien de rushes.

   Les règles reproduisent celles du robot (ds-editing-ops/agent-bali/lib/
   sources.mjs, fonction `classify` : Drive, SwissTransfer, WeTransfer,
   Dropbox, lien direct ; « manuel » pour Frame.io, Google Photos, iCloud,
   OneDrive, MEGA), avec DEUX ajouts assumés :
     1. les plateformes d'écoute et de vidéo (Spotify, Apple Podcasts, Deezer,
        SoundCloud, YouTube, Vimeo, Twitch…) et les réseaux sociaux sont
        refusés ici. Le robot, lui, ne refuse Spotify qu'au téléchargement,
        quand il découvre qu'il reçoit du HTML : c'est exactement le trou par
        lequel l'incident est passé ;
     2. quelques services de transfert réels mais non automatisables (Smash,
        Filemail, TransferNow, pCloud, Box…) passent en « manuel » plutôt que
        de tomber en « lien direct » et d'échouer chez le robot.
   Jusqu'où on bloque (décision de Cyriaque, 13/10/2026) : SEULEMENT ce qui ne
   peut pas être des rushes — une page d'écoute ou de réseau social, et une
   adresse qui n'en est pas une (faute de frappe). Un hébergeur qu'on ne connaît
   pas passe avec un avertissement : le récupérer à la main coûte 20 minutes,
   un client qui n'arrive pas à valider sa commande coûte la commande.

   Statuts rendus : "ok" (téléchargeable tout seul), "warn" (vrai matériel,
   récupéré à la main), "block" (ne peut pas être des rushes), "empty".
   Les libellés affichés vivent dans depot.html (I18N.lk), jamais ici : ce
   module ne connaît pas la langue, il rend une clé de message.
   ========================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module && module.exports) module.exports = api;
  if (root) root.DS_LINKS = api;
})(typeof globalThis !== "undefined" ? globalThis : null, function () {
  "use strict";

  // Pages web : jamais un fichier. Refusé. (label affiché tel quel, ou le domaine si null)
  var PAGE = [
    [/(^|\.)(spotify\.com|spoti\.fi)$/i, "Spotify"],
    [/(^|\.)(podcasts\.apple\.com|music\.apple\.com|itunes\.apple\.com)$/i, "Apple Podcasts"],
    [/(^|\.)(deezer\.com|dzr\.page\.link)$/i, "Deezer"],
    [/(^|\.)(soundcloud\.com|snd\.sc)$/i, "SoundCloud"],
    [/(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/i, "YouTube"],
    [/(^|\.)vimeo\.com$/i, "Vimeo"],
    [/(^|\.)(twitch\.tv|dailymotion\.com|dai\.ly)$/i, null],
    [/(^|\.)(instagram\.com|tiktok\.com|facebook\.com|fb\.watch|linkedin\.com|lnkd\.in|x\.com|twitter\.com|t\.co|threads\.net|snapchat\.com|reddit\.com|pinterest\.[a-z.]+)$/i, null],
    // hébergeurs de podcast : une page d'écoute, pas le fichier source
    [/(^|\.)(anchor\.fm|acast\.com|ausha\.co|podbean\.com|buzzsprout\.com|spreaker\.com|captivate\.fm|transistor\.fm|simplecast\.com|libsyn\.com|megaphone\.fm|redcircle\.com|castbox\.fm|podcastaddict\.com|audioboom\.com|rss\.com|mixcloud\.com|bandcamp\.com|audiomack\.com)$/i, null],
  ];

  // Vrai matériel, mais le robot ne sait pas le télécharger seul : on avertit, on laisse passer.
  var MANUAL = [
    [/(^|\.)(frame\.io|f\.io)$/i, "Frame.io"],
    [/(^|\.)(photos\.app\.goo\.gl|photos\.google\.com)$/i, "Google Photos"],
    [/(^|\.)icloud\.com$/i, "iCloud"],
    [/(^|\.)(1drv\.ms|onedrive\.live\.com|sharepoint\.com)$/i, "OneDrive"],
    [/(^|\.)(mega\.nz|mega\.co\.nz)$/i, "MEGA"],
    // ajout n° 2 (voir en-tête) : services de transfert réels, non automatisés chez nous
    [/(^|\.)(fromsmash\.com|smash\.app)$/i, "Smash"],
    [/(^|\.)filemail\.com$/i, "Filemail"],
    [/(^|\.)transfernow\.net$/i, "TransferNow"],
    [/(^|\.)grosfichiers\.com$/i, "GrosFichiers"],
    [/(^|\.)(pcloud\.com|pcloud\.link)$/i, "pCloud"],
    [/(^|\.)(box\.com|boxcloud\.com)$/i, "Box"],
    [/(^|\.)sync\.com$/i, "Sync"],
    [/(^|\.)(terabox\.com|1024terabox\.com)$/i, "TeraBox"],
    [/(^|\.)(disk\.yandex\.[a-z.]+|yadi\.sk)$/i, "Yandex Disk"],
    [/(^|\.)jumpshare\.com$/i, "Jumpshare"],
    [/(^|\.)(adobe\.com|adobe\.ly)$/i, "Adobe"],
    [/(^|\.)(proton\.me|protondrive\.com)$/i, "Proton Drive"],
  ];

  // Extensions de fichier acceptées pour un lien direct (rushes, archives, visuels, sous-titres).
  var FILE_EXT = /\.(mp4|mov|m4v|mkv|avi|mxf|mts|m2ts|mpg|mpeg|webm|wmv|flv|insv|braw|r3d|ari|dng|wav|aif|aiff|mp3|m4a|aac|flac|ogg|opus|zip|rar|7z|tar|gz|tgz|png|jpg|jpeg|heic|tif|tiff|psd|ai|aep|prproj|srt|vtt|pdf)$/i;

  // Un lien collé sans « https:// » est complété, comme le fait l'envoi (depot.html, linkList).
  function normalize(raw) {
    var s = String(raw == null ? "" : raw).trim().replace(/^[<(\["']+|[>)\]"',.;]+$/g, "");
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    if (/^[\w-]+(\.[\w-]+)+([/?#]\S*)?$/.test(s)) return "https://" + s;
    return s;
  }

  // Identifiant d'un lien Google Drive / Docs — mêmes règles que parseDriveLink (agent-bali/lib/drive.mjs).
  function parseDrive(u) {
    if (!/(^|\.)(drive|docs)\.google\.com$|(^|\.)drive\.usercontent\.google\.com$/i.test(u.hostname)) return null;
    var m = /\/(?:file\/d|folders|document\/d|spreadsheets\/d|presentation\/d|drawings\/d)\/([\w-]{10,})/.exec(u.pathname);
    var id = (m && m[1]) || u.searchParams.get("id");
    if (!id || !/^[\w-]{10,}$/.test(id)) return null;
    return { id: id, resourceKey: u.searchParams.get("resourcekey") || null };
  }

  function match(list, host) {
    for (var i = 0; i < list.length; i++) if (list[i][0].test(host)) return list[i];
    return null;
  }
  var shortHost = function (h) { return String(h || "").replace(/^www\./i, ""); };

  function res(kind, status, reason, label, url) {
    return { kind: kind, status: status, reason: reason, label: label || "", url: url || "" };
  }

  /** Classe UN lien. → { kind, status, reason, label, url } */
  function classify(raw) {
    var s = normalize(raw);
    if (!s) return res("", "empty", "", "", "");
    var u;
    try { u = new URL(s); } catch (e) { return res("bad", "block", "bad", "", s); }
    if (!/^https?:$/.test(u.protocol)) return res("bad", "block", "bad", "", s);
    if (!/^[\w-]+(\.[\w-]+)+$/.test(u.hostname)) return res("bad", "block", "bad", "", s); // « https://rushes » n'est pas une adresse
    var host = u.hostname.toLowerCase(), href = u.href;

    if (parseDrive(u)) return res("drive", "ok", "", "Google Drive", href);
    // Lien Drive sans identifiant lisible (« /drive/my-drive », « /drive/u/0/home ») : le robot ne peut rien en faire.
    if (/(^|\.)(drive|docs)\.google\.com$/i.test(host)) return res("drive", "block", "drive", "Google Drive", href);

    var page = match(PAGE, host);
    if (page) return res("page", "block", "page", page[1] || shortHost(host), href);

    var man = match(MANUAL, host);
    if (man) return res("manual", "warn", "manual", man[1] || shortHost(host), href);

    if (/(^|\.)swisstransfer\.com$/i.test(host)) return res("swisstransfer", "ok", "", "SwissTransfer", href);
    if (/(^|\.)(wetransfer\.com|we\.tl)$/i.test(host)) return res("wetransfer", "ok", "", "WeTransfer", href);
    if (/(^|\.)(dropbox\.com|dropboxusercontent\.com|db\.tt)$/i.test(host)) {
      if (/^\/(t|transfer)\//i.test(u.pathname)) return res("manual", "warn", "manual", "Dropbox Transfer", href);
      // page privée de l'appli, pas un lien de partage (robot : sources.mjs, dropbox())
      if (/^\/(request|home|work|personal)\b/i.test(u.pathname)) return res("dropbox", "block", "dropbox", "Dropbox", href);
      return res("dropbox", "ok", "", "Dropbox", href);
    }

    /* Lien direct. Avec une extension de fichier, le robot le prend seul. Sans extension sur un domaine
       inconnu, il ne saura probablement pas : AVERTISSEMENT, jamais un refus (décision de Cyriaque du
       13/10/2026). Récupérer des rushes à la main coûte 20 minutes ; un client qui n'arrive pas à valider
       sa commande coûte la commande. Seules les pages (Spotify & co.) et les vraies fautes de frappe
       bloquent encore. */
    var path = u.pathname;
    try { path = decodeURIComponent(u.pathname); } catch (e) { /* chemin mal encodé : on garde le brut */ }
    if (FILE_EXT.test(path)) return res("direct", "ok", "", shortHost(host), href);
    return res("unknown", "warn", "unknown", shortHost(host), href);
  }

  var RANK = { empty: 0, ok: 1, warn: 2, block: 3 };

  /** Classe le CONTENU d'un champ : plusieurs liens séparés par des espaces, comme à l'envoi.
      → { status, reason, label, url, items } — le pire statut gagne. */
  function classifyField(raw) {
    var parts = String(raw == null ? "" : raw).trim().split(/\s+/).filter(Boolean);
    var items = parts.map(classify);
    var worst = res("", "empty", "", "", "");
    for (var i = 0; i < items.length; i++) if (RANK[items[i].status] > RANK[worst.status]) worst = items[i];
    return { status: worst.status, reason: worst.reason, label: worst.label, url: worst.url, kind: worst.kind, items: items };
  }

  /** Vrai si ce champ ne peut pas être un lien de rushes (bloque le passage à l'étape suivante). */
  function blocked(raw) { return classifyField(raw).status === "block"; }

  return { classify: classify, classifyField: classifyField, blocked: blocked, normalize: normalize, PAGE: PAGE, MANUAL: MANUAL };
});
