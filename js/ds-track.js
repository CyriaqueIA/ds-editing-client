/* ============================================================
   DS Editing — suivi des visites du site public + bannière cookies (01/10/2026)
   - Bannière en bas de page (4 langues) : Accepter / Refuser, choix gardé dans localStorage ds_consent.
   - Après 20 s de présence : la visite est enregistrée (Supabase, site_visit_start) → alerte Telegram.
     Sans consentement : pays, sections vues, durée, provenance. Avec : + IP, clics, vidéo PostHog.
   - Mise à jour toutes les 15 s et quand l'onglet est quitté (site_visit_update).
   - window.dsTrack.lead(kind, data) : formulaire de contact / portfolio (site_lead_add) ; dsTrack.booked(email) : appel réservé.
   - Pages suivies (09/11/2026) : accueil, services/*.html, client/portfolio.html (bannière après le pop-up cadeau).
   - Équipe exclue : ?team=1 (ou une connexion au CRM) pose localStorage ds_team ; ?team=0 l'enlève.
   - PostHog : window.DS_POSTHOG.key dans index.html (vide = pas de vidéo).
   Lecture : ds-editing.com/crm/ → onglet « Visits » (Cyriaque, Sajid).
   ============================================================ */
(function () {
  'use strict';
  var RPC = 'https://xkanmjlpysxpohsuqvwg.supabase.co/rest/v1/rpc/';
  var KEY = 'sb_publishable_lIZtV_WtN5NcGSb0dnfaiQ_AgKYBIVa';
  var PH = window.DS_POSTHOG || {};
  var START_AFTER = 20, EVERY = 15;

  var get = function (s, k) { try { return window[s].getItem(k); } catch (e) { return null; } };
  var put = function (s, k, v) { try { if (v == null) window[s].removeItem(k); else window[s].setItem(k, v); } catch (e) {} };
  var rnd = function (n) { var c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', a = new Uint8Array(n), o = ''; (window.crypto || window.msCrypto).getRandomValues(a); for (var i = 0; i < n; i++) o += c[a[i] % c.length]; return o; };
  function rpc(fn, body, keepalive) {
    try {
      return fetch(RPC + fn, { method: 'POST', keepalive: !!keepalive, headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(function () {});
    } catch (e) { return Promise.resolve(); }
  }
  var lang = function () { var l = document.documentElement.lang; return ['en', 'fr', 'nl', 'da'].indexOf(l) >= 0 ? l : 'en'; };

  /* équipe */
  var qs = location.search;
  if (/[?&]team=1\b/.test(qs)) put('localStorage', 'ds_team', '1');
  if (/[?&]team=0\b/.test(qs)) put('localStorage', 'ds_team', null);
  var TEAM = get('localStorage', 'ds_team') === '1';

  /* consentement */
  var consent = function () { return get('localStorage', 'ds_consent') === 'yes'; };

  /* provenance (premier écran de la session) */
  function source() {
    var saved = get('sessionStorage', 'ds_src'); if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    var p = new URLSearchParams(location.search), ref = document.referrer || '', host = '';
    try { host = ref ? new URL(ref).hostname.replace(/^www\./, '') : ''; } catch (e) {}
    if (host === location.hostname.replace(/^www\./, '')) host = '';
    var MAP = [[/linkedin|lnkd\.in/, 'LinkedIn'], [/instagram/, 'Instagram'], [/facebook|fb\.com|fb\.me/, 'Facebook'], [/google\./, 'Google'], [/bing\./, 'Bing'], [/duckduckgo/, 'DuckDuckGo'], [/youtube|youtu\.be/, 'YouTube'], [/t\.co$|twitter|x\.com/, 'X'], [/tiktok/, 'TikTok'], [/trustpilot/, 'Trustpilot'], [/mail\.|outlook|gmail/, 'E-mail'], [/waalaxy/, 'Waalaxy'], [/chatgpt|openai|perplexity|claude\.ai/, 'IA (ChatGPT…)']];
    var named = p.get('utm_source') || p.get('ref') || p.get('src');
    var auto = ''; MAP.forEach(function (m) { if (!auto && host && m[0].test(host)) auto = m[1]; });
    var s = { source: named || auto || host || '', medium: p.get('utm_medium') || '', campaign: p.get('utm_campaign') || '', referrer: ref.slice(0, 300), landing: (location.pathname + location.search + location.hash).slice(0, 300) };
    put('sessionStorage', 'ds_src', JSON.stringify(s));
    return s;
  }
  var SRC = source();

  /* ---------- bannière cookies ---------- */
  var TXT = {
    en: { t: 'We use cookies to understand how our site is used and to improve it: visit statistics and session recordings (anything you type is masked).', ok: 'Accept', no: 'Refuse', pol: 'Privacy policy' },
    fr: { t: 'Nous utilisons des cookies pour comprendre l’usage du site et l’améliorer : statistiques de visite et enregistrement des sessions (ce que vous tapez est masqué).', ok: 'Accepter', no: 'Refuser', pol: 'Politique de confidentialité' },
    nl: { t: 'We gebruiken cookies om te begrijpen hoe onze site wordt gebruikt en om hem te verbeteren: bezoekstatistieken en sessie-opnames (wat je typt wordt afgeschermd).', ok: 'Accepteren', no: 'Weigeren', pol: 'Privacybeleid' },
    da: { t: 'Vi bruger cookies til at forstå, hvordan siden bruges, og til at forbedre den: besøgsstatistik og optagelse af sessioner (det, du skriver, skjules).', ok: 'Accepter', no: 'Afvis', pol: 'Privatlivspolitik' }
  };
  var bar = null;
  function paintBar() {
    if (!bar) return; var x = TXT[lang()];
    bar.querySelector('.ck-t').textContent = x.t; bar.querySelector('.ck-ok').textContent = x.ok; bar.querySelector('.ck-no').textContent = x.no;
    var a = bar.querySelector('.ck-pol'); a.textContent = x.pol; a.href = '/privacy.html?lang=' + lang();
  }
  function showBar() {
    if (!bar) {
      bar = document.createElement('div'); bar.className = 'ckbar'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Cookies');
      bar.innerHTML = '<p><span class="ck-t"></span> <a class="ck-pol" href="/privacy.html"></a></p><div class="ck-b"><button type="button" class="ck-no"></button><button type="button" class="ck-ok"></button></div>';
      bar.querySelector('.ck-ok').onclick = function () { decide('yes'); };
      bar.querySelector('.ck-no').onclick = function () { decide('no'); };
      document.body.appendChild(bar);
    }
    paintBar(); bar.hidden = false; requestAnimationFrame(function () { bar.classList.add('in'); ckh(); });
  }
  /* hauteur de la bannière → --ckh : le sticky « Réserver un appel » se pose au-dessus au lieu d'être caché (css/ds-consent.css) */
  function ckh() { if (bar && !bar.hidden) document.documentElement.style.setProperty('--ckh', bar.offsetHeight + 'px'); }
  window.addEventListener('resize', ckh);
  function decide(v) {
    put('localStorage', 'ds_consent', v); put('localStorage', 'ds_consent_at', new Date().toISOString());
    if (bar) { bar.classList.remove('in'); setTimeout(function () { bar.hidden = true; }, 300); }
    if (v === 'yes') { loadPosthog(); dirty = true; }
    else if (window.posthog && posthog.opt_out_capturing) { try { posthog.opt_out_capturing(); } catch (e) {} }
  }
  /* la bannière attend que la langue soit choisie (écran « Choose your language ») */
  function maybeBar() {
    if (get('localStorage', 'ds_consent')) return;
    if (document.getElementById('lgate') && !document.documentElement.classList.contains('lang-ok')) return;
    var g = document.getElementById('gift'); if (g && g.classList.contains('open')) return; /* portfolio : après le pop-up cadeau */
    showBar();
  }
  var giftEl = document.getElementById('gift'); if (giftEl) new MutationObserver(maybeBar).observe(giftEl, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(function () { maybeBar(); paintBar(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'lang'] });
  document.addEventListener('click', function (e) { var a = e.target.closest('.js-cookies'); if (!a) return; e.preventDefault(); showBar(); });

  /* ---------- PostHog (vidéo des visites), seulement avec consentement ---------- */
  var phLoaded = false;
  function loadPosthog() {
    if (phLoaded || TEAM || !PH.key || !consent()) return; phLoaded = true;
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify alias set_config reset opt_in_capturing opt_out_capturing get_session_id get_distinct_id".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init(PH.key, {
      api_host: PH.host || 'https://eu.i.posthog.com', person_profiles: 'identified_only',
      session_recording: { maskAllInputs: true, maskTextSelector: '.ph-mask' },
      loaded: function (ph) { ph.register({ ds_visit: TOKEN, ds_source: SRC.source || 'direct' }); dirty = true; }
    });
  }
  function phSession() { try { return window.posthog && posthog.get_session_id ? posthog.get_session_id() || null : null; } catch (e) { return null; } }

  /* ---------- la visite ---------- */
  var TOKEN = get('sessionStorage', 'ds_visit') || rnd(24); put('sessionStorage', 'ds_visit', TOKEN);
  var started = get('sessionStorage', 'ds_visit_started') === '1';
  var visible = 0, last = Date.now(), sections = [], clicks = [], clickCount = 0, formStarted = false, dirty = false, lastFlush = START_AFTER;
  try { sections = JSON.parse(get('sessionStorage', 'ds_sections') || '[]'); } catch (e) {}
  var vid = function () { if (!consent()) return null; var v = get('localStorage', 'ds_vid'); if (!v) { v = rnd(20); put('localStorage', 'ds_vid', v); } return v; };
  var device = function () { var w = Math.min(screen.width, innerWidth); return /Mobi|Android|iPhone/i.test(navigator.userAgent) || w < 700 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop'; };
  var browser = function () { var u = navigator.userAgent; return /Edg\//.test(u) ? 'Edge' : /OPR\//.test(u) ? 'Opera' : /Chrome\//.test(u) ? 'Chrome' : /Firefox\//.test(u) ? 'Firefox' : /Safari\//.test(u) ? 'Safari' : 'Other'; };
  function tick() { var now = Date.now(); if (document.visibilityState === 'visible') visible += (now - last) / 1000; last = now; }
  function payload() {
    var p = { consent: consent(), lang: lang(), sections: sections.slice(0, 60), duration: Math.round(visible), form_started: formStarted, click_count: clickCount, posthog_session: consent() ? phSession() : null, visitor_id: vid() };
    if (consent()) p.clicks = clicks.slice(-150);
    return p;
  }
  function start() {
    started = true; put('sessionStorage', 'ds_visit_started', '1');
    var p = payload(); p.tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || ''); p.device = device(); p.browser = browser();
    p.source = SRC.source; p.medium = SRC.medium; p.campaign = SRC.campaign; p.referrer = SRC.referrer; p.landing = SRC.landing;
    rpc('site_visit_start', { p_token: TOKEN, p: p }); dirty = false;
  }
  function flush(keep) { if (!started || !dirty) return; dirty = false; rpc('site_visit_update', { p_token: TOKEN, p: payload() }, keep); }

  if (!TEAM) {
    setInterval(function () {
      tick();
      if (!started && visible >= START_AFTER) start();
      else if (started && visible - lastFlush >= EVERY) { lastFlush = visible; dirty = true; flush(); }
    }, 1000);
    document.addEventListener('visibilitychange', function () { tick(); if (document.visibilityState === 'hidden') { dirty = true; flush(true); } });
    window.addEventListener('pagehide', function () { tick(); dirty = true; flush(true); });

    /* sections vues */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { var k = e.target.getAttribute('data-trk'); if (e.isIntersecting && sections.indexOf(k) < 0) { sections.push(k); put('sessionStorage', 'ds_sections', JSON.stringify(sections)); dirty = true; } });
      }, { threshold: 0.35 });
      /* nom d'une section : son id, sinon sa 1re classe (pages services) ; préfixé par la page hors accueil */
      var pg = location.pathname.replace(/\/index\.html$|\/$/, '').split('/').pop().replace(/\.html$/, '');
      document.querySelectorAll('section, footer').forEach(function (s) { var k = s.id || s.classList[0] || s.tagName.toLowerCase(); s.setAttribute('data-trk', pg ? pg + ':' + k : k); io.observe(s); });
    }
    /* clics (le libellé seulement ; jamais le contenu des champs) */
    document.addEventListener('click', function (e) {
      var el = e.target.closest('a,button,[data-video],.ep,.js-client,.js-book,label,summary'); if (!el) return;
      clickCount++; dirty = true;
      if (!consent()) return;
      var l = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('href') || el.className || '').replace(/\s+/g, ' ').trim().slice(0, 70);
      tick(); clicks.push({ t: Math.round(visible), l: l || '(sans texte)' });
    }, true);
    /* formulaire commencé */
    document.addEventListener('focusin', function (e) { if (!formStarted && e.target.matches && e.target.matches('input,textarea,select')) { formStarted = true; dirty = true; } });

    loadPosthog();
  }

  maybeBar();

  window.dsTrack = {
    lead: function (kind, d) {
      d = d || {}; if (!TEAM && started) { dirty = true; flush(); }
      rpc('site_lead_add', { p: { kind: kind, name: d.name || '', email: d.email || '', studio: d.studio || '', project_type: d.project_type || '', message: d.message || '', lang: lang(), visit_token: TEAM ? null : TOKEN } });
      if (!TEAM && consent() && window.posthog && posthog.identify && d.email) { try { posthog.identify(d.email, { name: d.name || '', studio: d.studio || '' }); } catch (e) {} }
    },
    booked: function (email) {
      if (TEAM) return;
      if (!started) start();
      setTimeout(function () { rpc('site_visit_booked', { p_token: TOKEN, p_email: email || null }); }, started ? 0 : 1500);
      if (consent() && window.posthog && posthog.identify && email) { try { posthog.identify(email); } catch (e) {} }
    },
    cookies: showBar
  };
})();
