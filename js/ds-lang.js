/* ============================================================
   DS Editing — écran « Choose your language » (accueil)
   - Le script en tête d'index.html pose html.lang-ok si une langue est déjà enregistrée (ou ?lang=xx) : l'écran ne s'affiche pas.
   - Un choix → window.dsSetLang (js/ds-app.js, qui enregistre ds_lang) puis l'écran s'efface.
   - Le lien « Language » du menu mobile rouvre l'écran.
   ============================================================ */
(function () {
  'use strict';
  var gate = document.getElementById('lgate'); if (!gate) return;
  var root = document.documentElement;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SUG = { en: 'Suggested', fr: 'Suggéré', nl: 'Aanbevolen', da: 'Foreslået' };
  var timer = null;

  /* titre qui défile dans les 4 langues */
  function cycle() {
    var spans = gate.querySelectorAll('.lgate-t span'), i = 0;
    clearInterval(timer);
    spans.forEach(function (s, k) { s.classList.toggle('on', k === 0); });
    if (reduced) return;
    timer = setInterval(function () { spans[i].classList.remove('on'); i = (i + 1) % spans.length; spans[i].classList.add('on'); }, 2200);
  }

  /* langue du navigateur mise en avant */
  function suggest() {
    var nav = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').slice(0, 2).toLowerCase();
    var btns = gate.querySelectorAll('button[data-l]'), best = null;
    btns.forEach(function (b) { b.classList.remove('sug'); if (b.dataset.l === nav) best = b; });
    if (best) { best.classList.add('sug'); best.querySelector('small').dataset.sug = SUG[nav]; }
    return best || btns[0];
  }

  function open() {
    gate.classList.remove('out'); gate.hidden = false; root.classList.remove('lang-ok');
    cycle(); var b = suggest(); setTimeout(function () { b.focus({ preventScroll: true }); }, 50);
  }
  function close() {
    root.classList.add('lang-ok'); clearInterval(timer);
  }

  gate.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-l]'); if (!b) return;
    if (window.dsSetLang) window.dsSetLang(b.dataset.l);
    gate.classList.add('out');
    setTimeout(close, reduced ? 0 : 550);
  });
  /* flèches du clavier entre les 4 choix */
  gate.addEventListener('keydown', function (e) {
    var btns = [].slice.call(gate.querySelectorAll('button[data-l]')), i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    var cols = matchMedia('(max-width:560px)').matches ? 1 : 2, d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
    if (d) { e.preventDefault(); btns[(i + d + btns.length) % btns.length].focus(); }
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('.js-lang-open'); if (!a) return;
    e.preventDefault();
    var mm = document.getElementById('mm'); if (mm) mm.classList.remove('open');
    open();
  });

  if (!root.classList.contains('lang-ok')) { cycle(); var b = suggest(); b.focus({ preventScroll: true }); }
})();
