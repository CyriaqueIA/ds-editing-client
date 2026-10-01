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
      nav: "Ads / VSL", kicker: "Ads / VSL",
      title: "Une VSL qui tient jusqu'au ", accent: "bouton.",
      lead: "Rythme serré, sous-titres, preuves à l'écran, appel à l'action clair. Une vidéo de vente pensée pour être regardée jusqu'au bout, pas pour être belle dans un dossier.",
      deliver: ["VSL 16:9 montée pour la conversion, chapitres et rappels visuels", "Versions courtes pour vos pubs et vos pages", "Sous-titres animés et habillage à votre charte"],
      strip: "Vidéos de vente montées pour convertir",
    },
    en: {
      nav: "Ads / VSL", kicker: "Ads / VSL",
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

// Traductions NL / DA (écran « Choose your language », 01/10/2026). Le français et l'anglais restent au-dessus.
(function () {
  var X = {"nl": {"podcast-interview": {"nav": "Podcast & Interview", "kicker": "Podcast & Interview", "title": "Je podcast, gemonteerd als een ", "accent": "show.", "lead": "Gesynchroniseerde multicam, stiltes eruit, schone audio, graphics, exports klaar om te publiceren. Jij stuurt het materiaal, je krijgt een aflevering die je alleen nog hoeft te uploaden.", "deliver": ["Volledige 16:9-aflevering, strak getimed, klaar om te publiceren", "Pakkende cold open of filmische titelsequentie op maat", "Reels, thumbnail en trailer uit dezelfde aflevering"], "strip": "Multicam-afleveringen klaar om te publiceren"}, "vsl": {"nav": "Ads / VSL", "kicker": "Ads / VSL", "title": "Een VSL die boeit tot aan de ", "accent": "knop.", "lead": "Strak tempo, ondertitels, bewijs in beeld, een duidelijke call to action. Een salesvideo gemaakt om tot het einde bekeken te worden, niet om mooi te staan in een map.", "deliver": ["16:9-VSL gemonteerd voor conversie, hoofdstukken en visuele callbacks", "Korte versies voor je ads en pagina’s", "Geanimeerde ondertitels en graphics in jouw huisstijl"], "strip": "Salesvideo’s gemonteerd om te converteren"}, "reels-shorts": {"nav": "Reels & Shorts", "kicker": "Reels & Shorts", "title": "Je beste momenten, ", "accent": "verticaal.", "lead": "Fragmenten gekozen om vanaf de eerste seconde te boeien, geanimeerde ondertitels, sound design, native formaten voor Instagram, TikTok en YouTube Shorts.", "deliver": ["Basic reels: beste momenten, geanimeerde ondertitels", "Signature reels: motion design, B-roll, advertentiekwaliteit", "Geleverd in batches, klaar om in te plannen"], "strip": "Reels en shorts die boeien"}, "ads": {"nav": "Ads", "kicker": "Ads", "title": "Ads gemonteerd om te ", "accent": "converteren.", "lead": "Hook, bewijs, aanbod, actie. Videocreatives voor Meta, TikTok en YouTube, in meerdere hooks gemonteerd zodat je snel kunt testen.", "deliver": ["Creatives in 9:16 en 1:1, meerdere hooks per concept", "UGC, productdemo, testimonial: gemonteerd op het tempo van het platform", "Snelle iteraties op basis van je resultaten"], "strip": "Videocreatives voor Meta, TikTok, YouTube"}, "youtube-docu": {"nav": "YouTube & Docu", "kicker": "YouTube & Documentaire", "title": "Long-form die ", "accent": "boeit.", "lead": "Verhalende montage, B-roll, motion design, hoofdstukken, exports klaar voor YouTube. Voor creators en merken die willen dat mensen tot het einde kijken.", "deliver": ["YouTube-video’s en documentaires, met doordacht tempo en verhaal", "Motion design en graphics in jouw stijl", "Hoofdstukken, thumbnail en geoptimaliseerde exports"], "strip": "Long-form YouTube en documentaire"}, "autres": {"nav": "Andere diensten", "kicker": "Andere diensten", "title": "Alles rondom de ", "accent": "video.", "lead": "Thumbnails, trailers, AI-video’s, color grading, motion design. De bouwstenen die van een aflevering een merk maken.", "deliver": ["Thumbnails en covervisuals", "Trailers en teasers voor je socials", "AI-video’s, filmische grading, motion design"], "strip": "Thumbnails, trailers, AI-video’s, grading"}}, "da": {"podcast-interview": {"nav": "Podcast & Interview", "kicker": "Podcast & Interview", "title": "Din podcast, klippet som et ", "accent": "show.", "lead": "Synkroniseret multicam, pauser klippet væk, rent lydbillede, grafik, eksporter klar til udgivelse. Du sender optagelserne, du får en episode, som du bare skal uploade.", "deliver": ["Hel 16:9-episode med tempo, klar til udgivelse", "Slagkraftig cold open eller skræddersyet filmisk titelsekvens", "Reels, thumbnail og trailer klippet fra samme episode"], "strip": "Multicam-episoder klar til udgivelse"}, "vsl": {"nav": "Ads / VSL", "kicker": "Ads / VSL", "title": "En VSL, der holder helt til ", "accent": "knappen.", "lead": "Stramt tempo, undertekster, beviser på skærmen, en tydelig call to action. En salgsvideo bygget til at blive set til ende, ikke til at se pæn ud i en mappe.", "deliver": ["16:9-VSL klippet til konvertering, kapitler og visuelle callbacks", "Korte versioner til dine annoncer og sider", "Animerede undertekster og grafik i dit brand"], "strip": "Salgsvideoer klippet til at konvertere"}, "reels-shorts": {"nav": "Reels & Shorts", "kicker": "Reels & Shorts", "title": "Dine bedste øjeblikke, ", "accent": "vertikalt.", "lead": "Klip udvalgt til at fange fra første sekund, animerede undertekster, sounddesign, native formater til Instagram, TikTok og YouTube Shorts.", "deliver": ["Basis-reels: de bedste øjeblikke, animerede undertekster", "Signature-reels: motion design, b-roll, reklamekvalitet", "Leveret i batches, klar til at planlægge"], "strip": "Reels og shorts, der fanger"}, "ads": {"nav": "Ads", "kicker": "Annoncer", "title": "Annoncer klippet til at ", "accent": "konvertere.", "lead": "Hook, bevis, tilbud, handling. Videocreatives til Meta, TikTok og YouTube, klippet med flere hooks, så du kan teste hurtigt.", "deliver": ["9:16- og 1:1-creatives, flere hooks pr. koncept", "UGC, produktdemo, testimonial: klippet i platformenes tempo", "Hurtige iterationer ud fra dine resultater"], "strip": "Videocreatives til Meta, TikTok, YouTube"}, "youtube-docu": {"nav": "YouTube & Docu", "kicker": "YouTube & Dokumentar", "title": "Long-form, der ", "accent": "fastholder.", "lead": "Narrativ klipning, b-roll, motion design, kapitler, eksporter klar til YouTube. Til skabere og brands, der vil have folk til at se med til det sidste.", "deliver": ["YouTube-videoer og dokumentarer med gennemarbejdet tempo og fortælling", "Motion design og grafik i din stil", "Kapitler, thumbnail og optimerede eksporter"], "strip": "Long-form YouTube og dokumentar"}, "autres": {"nav": "Andre services", "kicker": "Andre services", "title": "Alt omkring ", "accent": "videoen.", "lead": "Thumbnails, trailere, AI-videoer, color grading, motion design. Byggestenene, der forvandler en episode til et brand.", "deliver": ["Thumbnails og covervisuals", "Trailere og teasere til dine sociale medier", "AI-videoer, filmisk grading, motion design"], "strip": "Thumbnails, trailere, AI-videoer, grading"}}};
  window.DS_SERVICES.forEach(function (s) { Object.keys(X).forEach(function (l) { if (X[l][s.slug]) s[l] = X[l][s.slug]; }); });
  var U = {"nl": {"back": "Terug naar de site", "cta": "Praat met DS Editing", "ctaSub": "Reactie binnen één werkdag", "examples": "Voorbeelden", "examplesSoon": "Voorbeelden volgen binnenkort", "process": "Hoe we werken", "steps": [["Jij levert aan", "Je materiaal via een link, je briefing in vijf minuten, in je eigen omgeving."], ["Wij monteren", "Eén vaste editor, gecontroleerd door onze head of editing vóór levering."], ["Jij reviewt", "Frame-nauwkeurige feedback in frame.io, daarna keur je goed."]], "trust": "Zij vertrouwen ons", "trustpilot": "Onze reviews op Trustpilot", "deliver": "Wat je krijgt", "form": {"name": "Je naam", "email": "Je e-mail", "studio": "Je studio of merk", "message": "Je project in twee regels", "send": "Versturen", "sent": "Bedankt, we reageren binnen één werkdag.", "error": "Versturen mislukt, mail naar contact@ds-editing.com."}, "other": "Onze andere diensten", "showreel": "Bekijk de showreel"}, "da": {"back": "Tilbage til siden", "cta": "Tal med DS Editing", "ctaSub": "Svar inden for én arbejdsdag", "examples": "Eksempler", "examplesSoon": "Eksempler på vej", "process": "Sådan arbejder vi", "steps": [["Du sender", "Dine optagelser via link og din brief på fem minutter, i dit område."], ["Vi klipper", "Én fast klipper, tjekket af vores head of editing før levering."], ["Du gennemgår", "Kommentarer præcist på billedet i frame.io, og så godkender du."]], "trust": "De stoler på os", "trustpilot": "Vores anmeldelser på Trustpilot", "deliver": "Det får du", "form": {"name": "Dit navn", "email": "Din e-mail", "studio": "Dit studie eller brand", "message": "Dit projekt på to linjer", "send": "Send", "sent": "Tak, vi svarer inden for én arbejdsdag.", "error": "Afsendelsen mislykkedes, skriv til contact@ds-editing.com."}, "other": "Vores andre services", "showreel": "Se showreelen"}};
  Object.keys(U).forEach(function (l) { window.DS_SERVICES_UI[l] = U[l]; });
})();
