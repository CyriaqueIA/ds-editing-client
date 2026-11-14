// ============================================================
// DS Editing — Portfolio personnalisé par prospect (infopreneurs).
// Lien : client/portfolio.html?k=CLÉ&p=<slug>&ref=<slug>
//   → « Préparé pour {first} », SA démo (45 s), 3 accroches, nos exemples reels, prix masqués,
//     cadeau en tutoiement (numéro + nom de chaîne), bouton « Réserver 20 min ».
// Une fiche sans `demo` affiche « ta démo arrive » : NE PAS envoyer le lien tant que demo = null.
//   demo  : { src: "../videos/demos/<slug>.mp4", poster: "../videos/demos/<slug>.jpg" } (monté par Ilana)
//   hooks : 3 accroches (texte), écrites après visionnage
//   video : la vidéo source dont la démo est tirée
// ============================================================
window.DS_PROSPECTS = {
  "remi-roche": {
    first: "Rémi", name: "Rémi Roche", brand: "Agir Investir",
    video: { title: "10 chambres + 1 Airbnb : le projet FOU de Cindy en Creuse", url: "https://www.youtube.com/watch?v=Mr0bm0C_6BA" },
    demo: null, hooks: [],
  },
  "enzo-honore": {
    first: "Enzo", name: "Enzo Honoré", brand: "Les Entrepreneurs 2.0",
    video: { title: "Le grand gourou de la formation en ligne : ce qu'il gagne vraiment", url: "https://www.youtube.com/watch?v=UP5TYY-RniM" },
    demo: null, hooks: [],
  },
  "sandrine-larive": {
    first: "Sandrine", name: "Sandrine Larive", brand: "Kyrielle",
    video: { title: "Hommes, femmes : sommes-nous tous condamnés à la guerre ?", url: "https://www.youtube.com/watch?v=-xcNgApFoa0" },
    demo: null, hooks: [],
  },
  "stan-carrey": {
    first: "Stan", name: "Stan Carrey", brand: "Ma Sophrologie",
    video: { title: "Pourquoi tu te transformes en quelqu'un d'agressif face au PN ?", url: "https://www.youtube.com/watch?v=1BTXCNZMC7s" },
    demo: null, hooks: [],
  },
  "maxime-clergeau": {
    first: "Maxime", name: "Maxime Clergeau", brand: "Athletic Action",
    video: { title: "J'ai 6 semaines pour te rendre sec avant Noël", url: "https://www.youtube.com/watch?v=HQcymt9o9UA" },
    demo: null, hooks: [],
  },
  "william-laine": {
    first: "William", name: "William Laine", brand: "Coach Rameur",
    video: { title: "15 min de rameur pour soulager et renforcer ton dos", url: "https://www.youtube.com/watch?v=yk7pkqJOwrI" },
    demo: null, hooks: [],
  },
};
