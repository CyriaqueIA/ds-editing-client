// ============================================================
// DS Editing — Portfolio : UNE seule liste de vidéos pour tout le site.
// Utilisé par : les landings de services, le showreel, le portfolio privé,
// la section « Ils nous font confiance » et les aperçus de l'espace de dépôt.
//
// Pour ajouter une vidéo : une ligne dans `items`.
//   cat      : podcast-interview | vsl | reels-shorts | ads | youtube-docu | ia | miniatures | trailers
//   tier     : standard | premium
//   src      : fichier mp4 hébergé par nous (recommandé, lecture dans la grille)   ex. "videos/recordia-ep12.mp4"
//   poster   : image d'attente du mp4                                             ex. "videos/recordia-ep12.jpg"
//   url      : sinon, YouTube non répertorié ou Vimeo (lecteur externe)
//   studio   : nom exact d'un studio de `studios` (affiché seulement si `ok`)
//   best     : true = dans le showreel
// ============================================================
window.DS_PORTFOLIO = {
  items: [
    // { cat: "podcast-interview", tier: "premium", title: "Épisode 12 — Dr Weber", studio: "Recordia", src: "videos/recordia-ep12.mp4", poster: "videos/recordia-ep12.jpg", best: true },
  ],

  // Types de contenu (colonne de gauche du portfolio privé, onglets du showreel)
  types: [
    { slug: "podcast-interview", ratio: "16/9", fr: ["Podcast & Interview", "Multicam · Talk"], en: ["Podcast & Interview", "Multicam · Talk"] },
    // Ads et VSL = un seul type (décision du 30/09) : `also` rattache les vidéos rangées en cat "ads" au type "vsl".
    { slug: "vsl", also: ["ads"], ratio: "16/9", fr: ["Ads / VSL", "Vidéos de vente · Meta · TikTok · YouTube"], en: ["Ads / VSL", "Sales videos · Meta · TikTok · YouTube"] },
    { slug: "reels-shorts", ratio: "9/16", fr: ["Reels & Shorts", "TikTok · Instagram · Shorts"], en: ["Reels & Shorts", "TikTok · Instagram · Shorts"] },
    { slug: "youtube-docu", ratio: "16/9", fr: ["YouTube & Docu", "Long format · Brand film"], en: ["YouTube & Docu", "Long-form · Brand film"] },
    { slug: "ia", ratio: "16/9", fr: ["Vidéos IA", "Générées · Montées"], en: ["AI videos", "Generated · Edited"] },
    { slug: "miniatures", ratio: "16/9", fr: ["Miniatures", "Visuels de couverture"], en: ["Thumbnails", "Cover visuals"] },
    { slug: "trailers", ratio: "16/9", fr: ["Trailers", "60–90 s pour les réseaux"], en: ["Trailers", "60–90 s for socials"] },
  ],

  // Formules : mêmes noms partout (dépôt, portfolio privé, showreel)
  tiers: [
    { slug: "standard", fr: ["Standard", "Montage propre et rythmé, habillage simple, son mixé."], en: ["Standard", "Clean, paced edit, simple graphics, mixed sound."] },
    { slug: "premium", fr: ["Premium", "Standard + ouverture percutante de 20 à 30 s, titres animés, sound design."], en: ["Premium", "Standard + a punchy 20–30 s cold open, motion titles, sound design."] },
    { slug: "signature", fr: ["Signature", "Premium + intro façon « Diary of a CEO », b-roll premium, livraison prioritaire."], en: ["Signature", "Premium + a “Diary of a CEO”-style intro, premium b-roll, priority delivery."] },
  ],

  // Formules à masquer par type dans le portfolio privé, ex. { "vsl": ["signature"] }. Vide = les trois formules partout
  // (décision du 30/09 : Standard, Premium et Signature restent affichées sur Podcast et VSL).
  hiddenTiers: {},

  // Ouverture du portfolio privé sans ?type= dans le lien : ce type et cette formule (demande de Cyriaque du 03/10 : Podcast Signature).
  landing: { type: "podcast-interview", tier: "signature" },

  // true = aucun prix affiché dans le portfolio privé (demande de Cyriaque du 03/10). Repasser à false pour les réafficher.
  hidePrices: true,

  // Types sans exemple qui affichent la scène animée « bientôt » (orbe + « Premier montage offert ») au lieu des cases vides.
  // La scène disparaît d'elle-même dès qu'une vidéo du type arrive du Drive.
  soon: ["ia", "youtube-docu"],

  // Prix par type et par formule, affichés dans le portfolio PRIVÉ seulement (maquette validée par Cyriaque le 01/10/2026 : prix du marché quantifié).
  // Hors taxes, par vidéo livrée. Écrire le texte tel qu'il doit apparaître ; vide = « Sur devis ».
  // `unique` = une seule formule pour ce type (un seul onglet « Formule unique », toutes ses vidéos ensemble).
  // Jamais de prix dans la colonne de gauche (demande de Cyriaque).
  prices: {
    "podcast-interview": { standard: "119 €", premium: "199 €", signature: "279 €" },
    "vsl": { unique: "49 €" },
    "reels-shorts": { standard: "19 €", premium: "29 €", signature: "45 €" },
    "trailers": { unique: "49 €" },
    "miniatures": { unique: "25 €" },
    "youtube-docu": { standard: "99 €", premium: "169 €", signature: "239 €" },
    "ia": { standard: "", premium: "", signature: "" },
  },

  // Studios et créateurs qui nous confient leurs montages (section « Ils nous font confiance »).
  // `ok: true` = affiché. Logo dans assets/clients/. Cliquer sur un studio ouvre ses vidéos (items dont studio = name).
  studios: [
    { name: "The Move Miami", sub: "", url: "https://www.themovemiami.com", logo: "assets/clients/the-move-miami.png", ok: true },
    { name: "Mediacast", sub: "", url: "", logo: "assets/clients/mediacast.png", ok: true },
    { name: "A Life Elsewhere", sub: "Influencer · Content creator", url: "https://www.youtube.com/@ALifeElsewhere", logo: "assets/clients/a-life-elsewhere.png", ok: true },
    { name: "My Studio", sub: "", url: "", logo: "assets/clients/my-studio.png", ok: true },
    { name: "Prémices Studio", sub: "", url: "https://www.premicesstudio.com", logo: "assets/clients/premices-studio.png", ok: true },
    { name: "Recordia", sub: "", url: "", logo: "assets/clients/recordia.png", ok: true },
    { name: "DotCom", sub: "", url: "", logo: "assets/clients/dotcom.png", ok: true },
    { name: "Sept-Up", sub: "", url: "https://septup.io", logo: "assets/clients/sept-up.png", ok: true },
    { name: "Prime Studio", sub: "", url: "", logo: "assets/clients/prime-studio.png", ok: true },
  ],

  // Studio de chaque vidéo du Drive : { "<id Drive de la vidéo>": "Nom exact d'un studio ci-dessus" }.
  // Les ids sont dans client/previews.js (items[].id). Rempli par Cyriaque ; vide = la vidéo n'est rattachée à aucun studio.
  videoStudios: {
    "1f_J_-BPF7y_SVGedwqcicnV0o9NsbVYZ": "The Move Miami", // The Move Miami_Hannah Podcast_Extrait portfolio 4 min
  },

  contactEmail: "cyriaque.gely@ds-editing.com",
  contactPhone: "",  // numéro pro à ajouter plus tard
  trustpilot: "https://www.trustpilot.com/review/ds-editing.com",
};

// Vignette d'une vidéo : poster, thumb, sinon celle de YouTube.
window.dsThumb = function (item) {
  if (item.poster) return item.poster;
  if (item.thumb) return item.thumb;
  const yt = (item.url || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : "";
};
// Lien d'intégration (fenêtre) : YouTube et Vimeo, sinon null (nouvel onglet).
window.dsEmbed = function (url) {
  const yt = (url || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = (url || "").match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return null;
};

// Traductions NL / DA (accueil). Le français et l'anglais restent au-dessus.
(function () {
  var X = {"nl": {"types": {"podcast-interview": ["Podcast & Interview", "Multicam · Talk"], "vsl": ["Ads / VSL", "Salesvideo’s · Meta · TikTok · YouTube"], "reels-shorts": ["Reels & Shorts", "TikTok · Instagram · Shorts"], "youtube-docu": ["YouTube & Docu", "Long-form · Brand film"], "ia": ["AI-video’s", "Gegenereerd · Gemonteerd"], "miniatures": ["Thumbnails", "Covervisuals"], "trailers": ["Trailers", "60–90 s voor socials"]}, "tiers": {"standard": ["Standard", "Strakke, goed getimede montage, eenvoudige graphics, gemixt geluid."], "premium": ["Premium", "Standard + een pakkende cold open van 20–30 s, motion titles, sound design."], "signature": ["Signature", "Premium + een intro in “Diary of a CEO”-stijl, premium B-roll, prioritaire levering."]}}, "da": {"types": {"podcast-interview": ["Podcast & Interview", "Multicam · Talk"], "vsl": ["Ads / VSL", "Salgsvideoer · Meta · TikTok · YouTube"], "reels-shorts": ["Reels & Shorts", "TikTok · Instagram · Shorts"], "youtube-docu": ["YouTube & Docu", "Long-form · Brandfilm"], "ia": ["AI-videoer", "Genereret · Klippet"], "miniatures": ["Thumbnails", "Covervisuals"], "trailers": ["Trailere", "60–90 s til sociale medier"]}, "tiers": {"standard": ["Standard", "Rent klip med tempo, enkel grafik, mixet lyd."], "premium": ["Premium", "Standard + en slagkraftig cold open på 20–30 s, animerede titler, sounddesign."], "signature": ["Signature", "Premium + en intro i “Diary of a CEO”-stil, premium b-roll, prioriteret levering."]}}}, P = window.DS_PORTFOLIO;
  Object.keys(X).forEach(function (l) { ["types", "tiers"].forEach(function (k) { (P[k] || []).forEach(function (o) { if (X[l][k][o.slug]) o[l] = X[l][k][o.slug]; }); }); });
})();
