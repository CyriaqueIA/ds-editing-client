// Chargement différé des vidéos décoratives de l'accueil (index.html → video[data-lazy-src]).
/* 16/11/2026 — Vidéos décoratives de l'accueil (téléphone du bloc Reels, `data-lazy-src`) : chargées seulement quand le bloc
   approche de l'écran, et en pause dès qu'il en sort. Avant, 6 vidéos démarraient ensemble à l'ouverture (≈ 30 Mo) :
   la page ramait sur iPhone et les vidéos qu'on clique avaient du mal à démarrer. */
(function () {
  var vs = document.querySelectorAll('video[data-lazy-src]');
  if (!vs.length) return;
  function start(v) { if (!v.getAttribute('src')) v.src = v.getAttribute('data-lazy-src'); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(vs, start); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) start(e.target); else if (e.target.getAttribute('src')) e.target.pause(); });
  }, { rootMargin: '200px 0px' });
  Array.prototype.forEach.call(vs, function (v) { io.observe(v); });
})();
