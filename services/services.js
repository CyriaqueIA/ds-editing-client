// ============================================================
// DS Editing — Les services : menu, bande défilante et landings.
// Un service = un objet. Textes en français et en anglais.
// Modifier ici, puis lancer : node tools/build_landings.mjs
// ============================================================
window.DS_SERVICES = [
  {
    slug: "podcast-interview", icon: "mic",
    fr: {
      nav: "Podcast & Interview", kicker: "Podcast & Interview",
      title: "Votre podcast, monté comme une ", accent: "émission.",
      lead: "Multicam synchronisé, silences coupés, audio nettoyé, habillage, exports prêts à publier. Vous envoyez les rushes, vous recevez un épisode que vous n'avez plus qu'à mettre en ligne.",
      deliver: ["Épisode complet 16:9, rythmé, prêt à publier", "Ouverture percutante ou générique cinéma sur mesure", "Reels, miniature et trailer tirés du même épisode"],
      strip: "Épisodes multicam prêts à publier",
    },
    en: {
      nav: "Podcast & Interview", kicker: "Podcast & Interview",
      title: "Your podcast, edited like a ", accent: "show.",
      lead: "Synced multicam, silences cut, clean audio, graphics, publish-ready exports. You send the footage, you get an episode you only have to upload.",
      deliver: ["Full 16:9 episode, paced, ready to publish", "Punchy cold open or bespoke cinematic title sequence", "Reels, thumbnail and trailer cut from the same episode"],
      strip: "Publish-ready multicam episodes",
    },
  },
  {
    slug: "vsl", icon: "target",
    fr: {
      nav: "Tunnel de vente & VSL", kicker: "Tunnel de vente & VSL",
      title: "Une VSL qui tient jusqu'au ", accent: "bouton.",
      lead: "Rythme serré, sous-titres, preuves à l'écran, appel à l'action clair. Une vidéo de vente pensée pour être regardée jusqu'au bout, pas pour être belle dans un dossier.",
      deliver: ["VSL 16:9 montée pour la conversion, chapitres et rappels visuels", "Versions courtes pour vos pubs et vos pages", "Sous-titres animés et habillage à votre charte"],
      strip: "Vidéos de vente montées pour convertir",
    },
    en: {
      nav: "Sales funnel & VSL", kicker: "Sales funnel & VSL",
      title: "A VSL that holds until the ", accent: "button.",
      lead: "Tight pacing, captions, on-screen proof, a clear call to action. A sales video built to be watched to the end, not to look nice in a folder.",
      deliver: ["16:9 VSL edited for conversion, chapters and visual callbacks", "Short cuts for your ads and pages", "Animated captions and graphics in your brand"],
      strip: "Sales videos edited to convert",
    },
  },
  {
    slug: "reels-shorts", icon: "smartphone",
    fr: {
      nav: "Reels & Shorts", kicker: "Reels & Shorts",
      title: "Vos meilleurs moments, en ", accent: "vertical.",
      lead: "Extraits choisis pour accrocher dès la première seconde, sous-titres animés, sound design, format natif pour Instagram, TikTok et YouTube Shorts.",
      deliver: ["Reels basiques : les meilleurs moments, sous-titres animés", "Reels signature : motion design, b-roll, niveau publicitaire", "Livrés en lot, prêts à programmer"],
      strip: "Reels et shorts qui accrochent",
    },
    en: {
      nav: "Reels & Shorts", kicker: "Reels & Shorts",
      title: "Your best moments, ", accent: "vertical.",
      lead: "Clips picked to hook from the first second, animated captions, sound design, native formats for Instagram, TikTok and YouTube Shorts.",
      deliver: ["Basic reels: best moments, animated captions", "Signature reels: motion design, b-roll, ad-grade", "Delivered in batches, ready to schedule"],
      strip: "Reels and shorts that hook",
    },
  },
  {
    slug: "ads", icon: "megaphone",
    fr: {
      nav: "Ads", kicker: "Publicités",
      title: "Des pubs montées pour ", accent: "convertir.",
      lead: "Hook, preuve, offre, action. Des créatives vidéo pour Meta, TikTok et YouTube, déclinées en plusieurs accroches pour tester vite.",
      deliver: ["Créatives 9:16 et 1:1, plusieurs accroches par concept", "UGC, démo produit, témoignage : montés au rythme des plateformes", "Itérations rapides à partir de vos résultats"],
      strip: "Créatives vidéo pour Meta, TikTok, YouTube",
    },
    en: {
      nav: "Ads", kicker: "Ads",
      title: "Ads edited to ", accent: "convert.",
      lead: "Hook, proof, offer, action. Video creatives for Meta, TikTok and YouTube, cut into several hooks so you can test fast.",
      deliver: ["9:16 and 1:1 creatives, several hooks per concept", "UGC, product demo, testimonial: cut at platform pace", "Fast iterations from your results"],
      strip: "Video creatives for Meta, TikTok, YouTube",
    },
  },
  {
    slug: "youtube-docu", icon: "film",
    fr: {
      nav: "YouTube & Docu", kicker: "YouTube & Documentaire",
      title: "Du long format qui ", accent: "retient.",
      lead: "Montage narratif, b-roll, motion design, chapitres, exports prêts pour YouTube. Pour les créateurs et les marques qui veulent qu'on regarde jusqu'à la fin.",
      deliver: ["Vidéos YouTube et documentaires, rythme et narration travaillés", "Motion design et habillage à votre image", "Chapitres, miniature et exports optimisés"],
      strip: "Long format YouTube et documentaire",
    },
    en: {
      nav: "YouTube & Docu", kicker: "YouTube & Documentary",
      title: "Long-form that ", accent: "retains.",
      lead: "Narrative editing, b-roll, motion design, chapters, YouTube-ready exports. For creators and brands who want people to watch to the end.",
      deliver: ["YouTube videos and documentaries, crafted pacing and narrative", "Motion design and graphics in your image", "Chapters, thumbnail and optimised exports"],
      strip: "Long-form YouTube and documentary",
    },
  },
  {
    slug: "autres", icon: "sparkles",
    fr: {
      nav: "Autres services", kicker: "Autres services",
      title: "Tout ce qui entoure la ", accent: "vidéo.",
      lead: "Miniatures, trailers, vidéos IA, étalonnage, motion design. Les briques qui font qu'un épisode devient une marque.",
      deliver: ["Miniatures et visuels de couverture", "Trailers et teasers pour vos réseaux", "Vidéos IA, étalonnage cinéma, motion design"],
      strip: "Miniatures, trailers, vidéos IA, étalonnage",
    },
    en: {
      nav: "Other services", kicker: "Other services",
      title: "Everything around the ", accent: "video.",
      lead: "Thumbnails, trailers, AI videos, colour grading, motion design. The pieces that turn an episode into a brand.",
      deliver: ["Thumbnails and cover visuals", "Trailers and teasers for your socials", "AI videos, cinema grading, motion design"],
      strip: "Thumbnails, trailers, AI videos, grading",
    },
  },
];

// Textes communs aux landings
window.DS_SERVICES_UI = {
  fr: {
    back: "Retour au site", cta: "Parler à DS Editing", ctaSub: "Réponse sous 24 h ouvrées", examples: "Exemples", examplesSoon: "Exemples en cours d'ajout",
    process: "Comment on travaille", steps: [["Vous déposez", "Vos rushes par lien, votre brief en cinq minutes, dans votre espace."], ["On monte", "Un monteur dédié, validé par notre head of editing avant envoi."], ["Vous relisez", "Commentaires à la seconde près sur frame.io, puis vous approuvez."]],
    trust: "Ils nous font confiance", trustpilot: "Nos avis sur Trustpilot", deliver: "Ce que vous recevez",
    form: { name: "Votre nom", email: "Votre e-mail", studio: "Votre studio ou votre marque", message: "Votre projet en deux lignes", send: "Envoyer", sent: "Merci, on vous répond sous 24 h ouvrées.", error: "L'envoi a échoué, écrivez-nous à contact@ds-editing.com." },
    other: "Nos autres services", showreel: "Voir le showreel",
  },
  en: {
    back: "Back to site", cta: "Talk to DS Editing", ctaSub: "Reply within one business day", examples: "Examples", examplesSoon: "Examples coming soon",
    process: "How we work", steps: [["You submit", "Your footage by link, your brief in five minutes, in your space."], ["We edit", "One dedicated editor, checked by our head of editing before delivery."], ["You review", "Frame-accurate comments on frame.io, then you approve."]],
    trust: "They trust us", trustpilot: "Our reviews on Trustpilot", deliver: "What you get",
    form: { name: "Your name", email: "Your email", studio: "Your studio or brand", message: "Your project in two lines", send: "Send", sent: "Thanks, we reply within one business day.", error: "Sending failed, write to contact@ds-editing.com." },
    other: "Our other services", showreel: "Watch the showreel",
  },
};
