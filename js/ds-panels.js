/* ============================================================
   DS Editing — fenêtres sur place (index.html) : plus personne ne quitte l'accueil.
   Une seule fenêtre réutilisable (carte verre centrée, la page reste derrière) :
     · vidéo du rail « Nos montages » (mp4 local ou YouTube intégré)
     · service (.js-svc[data-cat]) : texte du service + exemples par formule
     · studio (.js-client[data-studio]) : vidéos montées pour ce studio
     · portfolio privé (.js-portfolio) : petit formulaire → FormSubmit
     · #showreel : toutes les vidéos, onglets par formule
   Données : client/portfolio.js (DS_PORTFOLIO), client/previews.js (DS_PREVIEWS),
   services/services.js (DS_SERVICES). Markup injecté à <!-- @panels --> (ou fin de body).
   Conventions : IIFE, lang(), MutationObserver sur `lang`, toasts dans #toast-root.
   Les boutons .js-book sont gérés ailleurs (js/ds-booking.js, par délégation) : on ne les binde pas.
   ============================================================ */
(function () {
  'use strict';
  var lang = function () { return document.documentElement.lang === 'fr' ? 'fr' : 'en'; };
  var pf = function () { return window.DS_PORTFOLIO || {}; };
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var find = function (arr, fn) { for (var i = 0; i < (arr || []).length; i++) if (fn(arr[i])) return arr[i]; return null; };
  var ENDPOINT = 'https://formsubmit.co/ajax/contact@ds-editing.com';
  var BOOK = function () { return window.DS_CALENDLY || '#contact'; };

  /* 0. textes */
  var T = {
    fr: {
      close: 'Fermer', work: 'Nos montages', reelKick: 'Showreel', all: 'Tout', examples: 'Exemples',
      exSoon: 'Exemples en cours d’ajout', exSoonSub: 'Les montages de cette catégorie arrivent. Demandez le portfolio privé pour les découvrir dès maintenant.',
      deliver: 'Ce que vous recevez', book: 'Réserver un appel', servicePage: 'Voir la page du service',
      trust: 'Ils nous font confiance', forStudio: 'Montés pour',
      vidSoon: 'Vidéos en cours d’ajout', vidSoonSub: 'Les montages réalisés pour {studio} arrivent bientôt. Demandez le portfolio privé pour les découvrir dès maintenant.',
      pfKick: 'Portfolio privé', pfTitle: 'Recevez le <span class="ac">portfolio privé.</span>',
      pfLead: 'Nos meilleurs montages, classés par catégorie et par formule, réservés aux studios et aux agences. On vous l’envoie par e-mail sous 24h.',
      name: 'Nom', email: 'E-mail', studio: 'Studio / société', phName: 'Jean Dupont', phEmail: 'vous@email.com', phStudio: 'Votre studio',
      send: 'Recevoir le portfolio', sending: 'Envoi…', note: 'Aucune newsletter, juste le portfolio.',
      errFields: 'Merci d’indiquer votre nom et votre e-mail.', errEmail: 'Cet e-mail ne semble pas valide.', fail: 'Une erreur est survenue. Réessayez.',
      sentTitle: 'On vous l’envoie <span class="ac">sous 24h.</span>',
      sentLead: 'Merci {name}, le portfolio privé part sur {email}. En attendant, réservez votre appel découverte : 20 minutes, et votre premier montage est offert.',
      bookNow: 'Réserver un appel maintenant', askPf: 'Demander le portfolio privé', image: 'Visuel', video: 'Vidéo',
    },
    en: {
      close: 'Close', work: 'Our edits', reelKick: 'Showreel', all: 'All', examples: 'Examples',
      exSoon: 'Examples coming soon', exSoonSub: 'Edits for this category are on their way. Request the private portfolio to see them right now.',
      deliver: 'What you get', book: 'Book a call', servicePage: 'See the service page',
      trust: 'They trust us', forStudio: 'Edited for',
      vidSoon: 'Videos coming soon', vidSoonSub: 'The edits we made for {studio} are on their way. Request the private portfolio to see them right now.',
      pfKick: 'Private portfolio', pfTitle: 'Get the <span class="ac">private portfolio.</span>',
      pfLead: 'Our best edits, sorted by category and by pack, reserved for studios and agencies. We email it to you within 24 hours.',
      name: 'Name', email: 'Email', studio: 'Studio / company', phName: 'Jane Doe', phEmail: 'you@email.com', phStudio: 'Your studio',
      send: 'Get the portfolio', sending: 'Sending…', note: 'No newsletter, just the portfolio.',
      errFields: 'Please enter your name and your email.', errEmail: 'This email doesn’t look valid.', fail: 'Something went wrong. Please try again.',
      sentTitle: 'It’s on its way <span class="ac">within 24h.</span>',
      sentLead: 'Thanks {name}, the private portfolio is heading to {email}. Meanwhile, book your discovery call: 20 minutes, and your first edit is free.',
      bookNow: 'Book a call now', askPf: 'Request the private portfolio', image: 'Visual', video: 'Video',
    }
  };
  var t = function () { return T[lang()]; };
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l15 8-15 8z"></path></svg>';
  var EYE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"></path></svg>';
  var FILM = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="3"></rect><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"></path></svg>';

  /* 1. toasts (même rendu que js/ds-extras.js) */
  function toast(msg, type) {
    var root = document.getElementById('toast-root');
    if (!root) { root = document.createElement('div'); root.id = 'toast-root'; document.body.appendChild(root); }
    var el = document.createElement('div'); el.className = 'toast ' + (type || ''); el.textContent = msg; root.appendChild(el);
    setTimeout(function () { el.remove(); }, 4500);
  }

  /* 2. données : liste unique des vidéos (format v2 de previews.js, sinon ancien format), + items manuels de portfolio.js */
  function allItems() {
    var P = pf(), V = window.DS_PREVIEWS || {}, out = [], seen = {};
    var strip = function (p) { return String(p || '').replace(/^(\.\.\/)+/, ''); };
    var push = function (it) {
      if (!it || !it.id || seen[it.id]) return; seen[it.id] = 1;
      it.studio = (P.videoStudios || {})[it.id] || it.studio || '';
      out.push(it);
    };
    if (Array.isArray(V.items)) {
      V.items.forEach(function (it) {
        if (!it || it.cat === 'cta') return;
        push({ id: it.id, cat: it.cat, tier: it.tier || null, lang: it.lang || null, title: it.title || '', path: strip(it.path), posterPath: strip(it.posterPath), vertical: !!it.vertical, image: !!it.image, url: '' });
      });
    } else {
      var legacy = function (list, cat, tier, lg) {
        (list || []).forEach(function (v) {
          var p = strip(v.src);
          push({ id: p.replace(/^.*\//, '').replace(/\.\w+$/, ''), cat: cat, tier: tier, lang: lg, title: v.title || '', path: p, posterPath: strip(v.poster), vertical: !!v.vertical, image: false, url: '' });
        });
      };
      ['podcast', 'vsl'].forEach(function (k) {
        ['standard', 'premium'].forEach(function (ti) { ['fr', 'en'].forEach(function (lg) { legacy(V[k] && V[k][ti] && V[k][ti][lg], k === 'podcast' ? 'podcast-interview' : 'vsl', ti, lg); }); });
      });
      ['fr', 'en'].forEach(function (lg) {
        legacy(V.reel_basique && V.reel_basique[lg], 'reels-shorts', 'standard', lg);
        legacy(V.reel_signature && V.reel_signature[lg], 'reels-shorts', 'premium', lg);
      });
    }
    (P.items || []).forEach(function (it, i) {
      var ty = find(P.types, function (x) { return x.slug === it.cat; });
      push({ id: it.id || it.src || it.url || ('manual-' + i), cat: it.cat, tier: it.tier || null, lang: it.lang || null, title: it.title || '', path: it.src || '', posterPath: it.poster || (window.dsThumb ? window.dsThumb(it) : ''), vertical: ty ? ty.ratio === '9/16' : false, image: false, url: it.url || '', studio: it.studio || '' });
    });
    return out;
  }
  var tierName = function (slug) { var tr = find(pf().tiers, function (x) { return x.slug === slug; }); return tr ? tr[lang()][0] : ''; };
  var typeName = function (slug) { var ty = find(pf().types, function (x) { return x.slug === slug || (x.also || []).indexOf(slug) >= 0; }); return ty ? ty[lang()][0] : ''; };
  /* tri : langue courante d'abord, puis 16:9 avant 9:16 (deux grilles), ordre source sinon */
  function sortItems(items) {
    var l = lang();
    return items.slice().sort(function (a, b) { return ((a.lang === l) ? 0 : 1) - ((b.lang === l) ? 0 : 1); });
  }
  function tiersOf(items) {
    return (pf().tiers || []).filter(function (tr) { return items.some(function (it) { return it.tier === tr.slug; }); });
  }

  /* 3. la fenêtre (markup injecté) */
  var root, win, kickEl, titleEl, body, foot, xBtn, state = null, opener = null, hideTimer = null;
  function build() {
    root = document.createElement('div');
    root.className = 'ds-ov'; root.id = 'ds-panel'; root.hidden = true;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'ds-panel-title');
    root.innerHTML =
      '<div class="ds-win" role="document" tabindex="-1">' +
        '<div class="ds-win-h"><div class="ds-win-hh"><span class="mono ds-kick"></span><h3 class="ds-title" id="ds-panel-title"></h3></div>' +
        '<button type="button" class="ds-x" aria-label="Fermer">×</button></div>' +
        '<div class="ds-win-b"></div>' +
        '<div class="ds-win-f" hidden></div>' +
      '</div>';
    var anchor = null;
    for (var n = document.body.firstChild; n; n = n.nextSibling) if (n.nodeType === 8 && /@panels/.test(n.nodeValue)) { anchor = n; break; }
    if (anchor) anchor.parentNode.insertBefore(root, anchor.nextSibling); else document.body.appendChild(root);
    win = root.firstChild; kickEl = root.querySelector('.ds-kick'); titleEl = root.querySelector('.ds-title');
    body = root.querySelector('.ds-win-b'); foot = root.querySelector('.ds-win-f'); xBtn = root.querySelector('.ds-x');
    xBtn.addEventListener('click', close);
    root.addEventListener('click', function (e) {
      if (e.target === root) { close(); return; }
      var tab = e.target.closest('.ds-tab[data-tier]');
      if (tab && state) { state.tier = tab.dataset.tier; render(); return; }
      var cell = e.target.closest('.ds-cell[data-id]');
      if (cell && state) { play(cell.dataset.id); return; }
      if (e.target.closest('.js-book')) { setTimeout(close, 0); }
    });
    root.addEventListener('submit', function (e) { if (e.target.id === 'ds-pf-form') { e.preventDefault(); sendPortfolio(e.target); } });
    root.addEventListener('input', function (e) { if (e.target.classList) e.target.classList.remove('bad'); });
    /* clavier : Échap ferme, Tab reste dans la fenêtre */
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(root.querySelectorAll('button,[href],input,select,textarea,iframe,video,[tabindex]:not([tabindex="-1"])'), function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function isOpen() { return !!state; }
  function open(view, data, from) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (state) stopMedia();
    else {
      opener = from || document.activeElement;
      var gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden'; if (gap > 0) document.body.style.paddingRight = gap + 'px';
    }
    state = { view: view, data: data || {}, tier: 'all', current: null, media: null };
    root.hidden = false;
    render();
    body.scrollTop = 0;
    if (reduced()) root.classList.add('on');
    else requestAnimationFrame(function () { requestAnimationFrame(function () { if (state) root.classList.add('on'); }); });
    try { win.focus({ preventScroll: true }); } catch (e) { win.focus(); }
  }
  function close() {
    if (!state) return;
    stopMedia(); state = null;
    root.classList.remove('on');
    document.body.style.overflow = ''; document.body.style.paddingRight = '';
    var done = function () { hideTimer = null; if (!state) { root.hidden = true; body.innerHTML = ''; foot.innerHTML = ''; } };
    if (reduced()) done(); else hideTimer = setTimeout(done, 220);
    if (location.hash === '#showreel') try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (opener && opener.focus && document.contains(opener)) try { opener.focus({ preventScroll: true }); } catch (e) {}
    opener = null;
  }

  /* 4. lecture : un lecteur en haut de la fenêtre (mp4 son activé, YouTube intégré, ou image plein cadre) */
  function prevent(e) { e.preventDefault(); }
  function mediaFor(item) {
    var m;
    if (item.image) { m = document.createElement('img'); m.src = item.path; m.alt = item.title || ''; }
    else if (item.path) {
      m = document.createElement('video');
      m.src = item.path; if (item.posterPath) m.poster = item.posterPath;
      m.controls = true; m.autoplay = true; m.playsInline = true; m.setAttribute('playsinline', ''); m.preload = 'metadata';
      m.setAttribute('controlsList', 'nodownload noremoteplayback'); m.disablePictureInPicture = true; m.disableRemotePlayback = true;
      m.muted = false; m.volume = 1;
    } else {
      var em = window.dsEmbed ? window.dsEmbed(item.url) : null;
      if (!em) return null;
      m = document.createElement('iframe'); m.src = em; m.title = item.title || 'YouTube';
      m.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; m.allowFullscreen = true; m.referrerPolicy = 'strict-origin-when-cross-origin';
    }
    m.addEventListener('contextmenu', prevent);
    return m;
  }
  function stopMedia() {
    if (state && state.media) { var m = state.media; try { if (m.pause) m.pause(); if (m.tagName !== 'IMG') m.removeAttribute('src'); } catch (e) {} m.remove(); state.media = null; }
  }
  function mountStage(item, media, slot, noCap) {
    var stage = document.createElement('div');
    stage.className = 'ds-stage' + (item.vertical ? ' vert' : '') + (item.image ? ' img' : '');
    stage.appendChild(media);
    var sub = [item.tier ? tierName(item.tier) : '', typeName(item.cat), item.lang ? item.lang.toUpperCase() : ''].filter(Boolean).join(' · ');
    if (!noCap && (item.title || sub)) stage.insertAdjacentHTML('beforeend', '<div class="ds-stage-cap">' + esc(item.title) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>');
    slot.innerHTML = ''; slot.appendChild(stage);
    if (media.tagName === 'VIDEO') media.play().catch(function () {});
  }
  function play(id) {
    var item = find(state.items, function (x) { return x.id === id; }); if (!item) return;
    stopMedia();
    var media = mediaFor(item); if (!media) return;
    state.current = id; state.media = media;
    mountStage(item, media, body.querySelector('.ds-stage-slot'));
    body.querySelectorAll('.ds-cell').forEach(function (c) { c.classList.toggle('on', c.dataset.id === id); });
    body.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* 5. rendu (re-joué à chaque changement de langue ou d'onglet ; le média en cours est conservé) */
  function tabsHtml(items) {
    var tiers = tiersOf(items);
    if (tiers.length < 2) { if (state.tier !== 'all') state.tier = 'all'; return ''; }
    if (state.tier !== 'all' && !find(tiers, function (x) { return x.slug === state.tier; })) state.tier = 'all';
    var l = lang(), all = [{ slug: 'all', name: t().all }].concat(tiers.map(function (x) { return { slug: x.slug, name: x[l][0] }; }));
    return '<div class="ds-tabs" role="tablist">' + all.map(function (x) { return '<button type="button" role="tab" class="ds-tab' + (state.tier === x.slug ? ' on' : '') + '" aria-selected="' + (state.tier === x.slug) + '" data-tier="' + x.slug + '">' + esc(x.name) + '</button>'; }).join('') + '</div>';
  }
  function cellHtml(it) {
    var sub = [it.tier ? tierName(it.tier) : '', typeName(it.cat)].filter(Boolean).join(' · ');
    return '<button type="button" class="ds-cell' + (it.vertical ? ' vert' : '') + (state.current === it.id ? ' on' : '') + '" data-id="' + esc(it.id) + '" aria-label="' + esc(it.title) + '">' +
      (it.posterPath ? '<img src="' + esc(it.posterPath) + '" alt="" loading="lazy">' : '') +
      '<span class="ds-play">' + (it.image ? EYE : PLAY) + '</span>' +
      '<span class="ds-cap">' + esc(it.title) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></button>';
  }
  function gridHtml(items, empty) {
    var list = items.filter(function (it) { return state.tier === 'all' || it.tier === state.tier; });
    if (!list.length) return empty;
    var wide = list.filter(function (it) { return !it.vertical; }), tall = list.filter(function (it) { return it.vertical; });
    return (wide.length ? '<div class="ds-grid">' + wide.map(cellHtml).join('') + '</div>' : '') +
           (tall.length ? '<div class="ds-grid vert">' + tall.map(cellHtml).join('') + '</div>' : '');
  }
  function emptyHtml(title, sub) {
    return '<div class="ds-empty"><span class="ds-empty-ic">' + FILM + '</span><b>' + esc(title) + '</b><p>' + esc(sub) + '</p>' +
      '<button type="button" class="btn btn-line btn-sm js-portfolio">' + esc(t().askPf) + '</button></div>';
  }
  var bookBtn = function (label) { return '<a class="btn btn-ac js-book" href="' + esc(BOOK()) + '">' + esc(label || t().book) + '</a>'; };

  var VIEWS = {
    /* vidéo du rail : titre de la carte, lecteur 16:9, méta */
    video: function (d) {
      var ep = d.ep, tEl = ep.querySelector('.cap .t'), tag = ep.querySelector('.tag');
      var meta = Array.prototype.map.call(ep.querySelectorAll('.cap .s span'), function (s) { return s.textContent.trim(); }).filter(Boolean);
      var img = ep.querySelector('img');
      var item = { id: 'rail', title: tEl ? tEl.textContent.trim() : '', path: ep.dataset.video || '', url: ep.getAttribute('href') || '', posterPath: img ? img.getAttribute('src') : '', vertical: false, image: false };
      state.items = [item];
      return {
        kick: t().work + (tag ? ' · ' + tag.textContent.trim() : ''),
        title: esc(item.title) || t().video,
        body: '<div class="ds-stage-slot"></div>' + (meta.length ? '<div class="ds-meta mono">' + meta.map(esc).join(' · ') + '</div>' : ''),
        foot: bookBtn(), autoplay: item, wide: true
      };
    },
    /* service : kicker + titre + lead + « ce que vous recevez » + onglets + exemples */
    service: function (d) {
      var l = lang(), slug = d.cat === 'trailers' ? 'autres' : d.cat, cats = d.cat === 'trailers' ? ['trailers', 'ia', 'miniatures'] : [d.cat];
      var s = find(window.DS_SERVICES, function (x) { return x.slug === slug; }), tx = s ? s[l] : null;
      var items = sortItems(allItems().filter(function (it) { return cats.indexOf(it.cat) >= 0; }));
      state.items = items;
      var ui = (window.DS_SERVICES_UI || {})[l] || {};
      return {
        kick: tx ? tx.kicker : (d.label || ''),
        title: tx ? esc(tx.title) + '<span class="ac">' + esc(tx.accent) + '</span>' : esc(d.label || ''),
        body: '<div class="ds-stage-slot"></div>' +
          (tx ? '<p class="ds-lead">' + esc(tx.lead) + '</p>' +
            '<div class="ds-deliver"><span class="mono">' + esc(ui.deliver || t().deliver) + '</span><ul>' + tx.deliver.map(function (x) { return '<li>' + CHECK + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' : '') +
          '<div class="ds-ex"><span class="mono">' + esc(ui.examples || t().examples) + '</span>' + tabsHtml(items) + '</div>' +
          gridHtml(items, emptyHtml(ui.examplesSoon || t().exSoon, t().exSoonSub)),
        foot: bookBtn() + (d.href ? '<a class="ds-more" href="' + esc(d.href) + '">' + esc(t().servicePage) + ' →</a>' : '')
      };
    },
    /* studio : logo + nom + sous-titre, vidéos dont studio = ce nom */
    studio: function (d) {
      var P = pf(), st = find(P.studios, function (x) { return x.name === d.name; }) || {};
      var items = sortItems(allItems().filter(function (it) { return it.studio === d.name; }));
      state.items = items;
      var sub = st.sub || d.sub || '';
      return {
        kick: t().trust,
        title: esc(t().forStudio) + ' <span class="ac">' + esc(d.name) + '</span>',
        body: '<div class="ds-stage-slot"></div>' +
          '<div class="ds-studio">' + (d.logo ? '<img src="' + esc(d.logo) + '" alt="">' : '') + '<div><b>' + esc(d.name) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</div></div>' +
          (items.length ? '<div class="ds-ex">' + tabsHtml(items) + '</div>' : '') +
          gridHtml(items, emptyHtml(t().vidSoon, t().vidSoonSub.replace('{studio}', d.name))),
        foot: bookBtn()
      };
    },
    /* portfolio privé : formulaire → FormSubmit, puis écran de succès */
    portfolio: function (d) {
      var x = t();
      if (d.sent) {
        return {
          kick: x.pfKick, title: x.sentTitle,
          body: '<div class="ds-done"><span class="ds-done-ic">' + CHECK + '</span><p>' + esc(x.sentLead.replace('{name}', d.sent.name).replace('{email}', d.sent.email)) + '</p>' + bookBtn(x.bookNow) + '</div>',
          foot: ''
        };
      }
      var v = d.values || {};
      var field = function (name, type, label, ph) { return '<label><span class="mono">' + esc(label) + '</span><input class="ds-in" name="' + name + '" type="' + type + '" value="' + esc(v[name] || '') + '" placeholder="' + esc(ph) + '" autocomplete="' + (name === 'name' ? 'name' : name === 'email' ? 'email' : 'organization') + '"' + (name !== 'studio' ? ' required' : '') + '></label>'; };
      return {
        kick: x.pfKick, title: x.pfTitle,
        body: '<p class="ds-lead">' + esc(x.pfLead) + '</p>' +
          '<form class="ds-form" id="ds-pf-form" novalidate><input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">' +
          field('name', 'text', x.name, x.phName) + field('email', 'email', x.email, x.phEmail) + field('studio', 'text', x.studio, x.phStudio) +
          '<button type="submit" class="btn btn-ac ds-submit"><span>' + esc(d.sending ? x.sending : x.send) + '</span></button><p class="ds-note">' + esc(x.note) + '</p></form>',
        foot: '', narrow: true
      };
    },
    /* showreel : toutes les vidéos, onglets par formule */
    reel: function () {
      var items = sortItems(allItems());
      state.items = items;
      return {
        kick: t().reelKick, title: esc(t().work),
        body: '<div class="ds-stage-slot"></div><div class="ds-ex">' + tabsHtml(items) + '</div>' + gridHtml(items, emptyHtml(t().vidSoon, t().exSoonSub)),
        foot: bookBtn()
      };
    }
  };

  function render() {
    if (!state) return;
    var keep = state.media, curId = state.current;
    if (keep && keep.parentNode) keep.parentNode.removeChild(keep);
    if (state.view === 'portfolio' && !state.data.sent) {
      var f = body.querySelector('#ds-pf-form');
      if (f) state.data.values = { name: fld(f, 'name').value, email: fld(f, 'email').value, studio: fld(f, 'studio').value };
    }
    var spec = VIEWS[state.view](state.data);
    kickEl.textContent = spec.kick || ''; kickEl.hidden = !spec.kick;
    titleEl.innerHTML = spec.title || '';
    xBtn.setAttribute('aria-label', t().close); xBtn.title = t().close;
    root.dataset.view = state.view;
    win.classList.toggle('narrow', !!spec.narrow); win.classList.toggle('wide', !!spec.wide);
    body.innerHTML = spec.body || '';
    foot.innerHTML = spec.foot || ''; foot.hidden = !spec.foot;
    var slot = body.querySelector('.ds-stage-slot');
    if (spec.autoplay && slot) {
      if (!keep) { keep = mediaFor(spec.autoplay); state.media = keep; state.current = spec.autoplay.id; }
      if (keep) mountStage(spec.autoplay, keep, slot, true);
      else slot.innerHTML = emptyHtml(t().vidSoon, t().exSoonSub);
    } else if (keep && curId && slot) {
      var item = find(state.items, function (x) { return x.id === curId; });
      if (item) { mountStage(item, keep, slot); body.querySelectorAll('.ds-cell').forEach(function (c) { c.classList.toggle('on', c.dataset.id === curId); }); }
      else { stopMedia(); state.current = null; }
    }
  }

  /* 6. portfolio privé : envoi */
  var fld = function (form, n) { return form.querySelector('[name="' + n + '"]'); };
  function sendPortfolio(form) {
    var x = t(), data = { name: fld(form, 'name').value.trim(), email: fld(form, 'email').value.trim(), studio: fld(form, 'studio').value.trim() };
    form.querySelectorAll('.ds-in').forEach(function (i) { i.classList.remove('bad'); });
    if (!data.name || !data.email) { if (!data.name) fld(form, 'name').classList.add('bad'); if (!data.email) fld(form, 'email').classList.add('bad'); toast(x.errFields, 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) { fld(form, 'email').classList.add('bad'); toast(x.errEmail, 'error'); return; }
    var btn = form.querySelector('.ds-submit'), lab = btn.querySelector('span');
    btn.disabled = true; lab.textContent = x.sending; state.data.sending = true;
    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, studio: data.studio, _subject: 'Demande de portfolio privé — ' + (data.studio || data.name) })
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json ? r.json().catch(function () { return {}; }) : {}; })
      .then(function () { if (state && state.view === 'portfolio') { state.data.sent = data; state.data.sending = false; render(); } })
      .catch(function () { toast(x.fail, 'error'); if (state && state.view === 'portfolio') { state.data.sending = false; if (document.contains(btn)) { btn.disabled = false; lab.textContent = t().send; } } });
  }

  /* 7. ouvertures */
  function openVideo(ep) { open('video', { ep: ep }, ep); }
  function openService(a) {
    var h = a.querySelector('h4');
    open('service', { cat: a.dataset.cat, href: a.getAttribute('href') || '', label: h ? h.textContent.trim() : '' }, a);
  }
  function openStudio(b) {
    var img = b.querySelector('img'), sub = b.querySelector('span');
    open('studio', { name: b.dataset.studio, logo: img ? img.getAttribute('src') : '', sub: sub ? sub.textContent.trim() : '' }, b);
  }
  function openPortfolio(from) { open('portfolio', {}, from); }
  function openReel() { open('reel', {}); }

  /* 8. délégation (le rail est cloné par [data-loop] : les clones sont couverts) */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target : null; if (!el) return;
    var inPanel = root && root.contains(el);
    var pfb = el.closest('.js-portfolio');
    if (pfb) { e.preventDefault(); openPortfolio(inPanel ? null : pfb); return; }
    if (inPanel) return;
    var ep = el.closest('.ep[data-video], .ep[href]');
    if (ep) { e.preventDefault(); openVideo(ep); return; }
    var svc = el.closest('.js-svc[data-cat]');
    if (svc) { e.preventDefault(); openService(svc); return; }
    var cl = el.closest('.js-client[data-studio]');
    if (cl) { e.preventDefault(); openStudio(cl); return; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(); });
  /* pas de clic droit sur les vidéos du site (hero, packs, rail) */
  document.addEventListener('contextmenu', function (e) { if (e.target && e.target.tagName === 'VIDEO') e.preventDefault(); });

  /* 9. langue : la fenêtre ouverte se retraduit */
  new MutationObserver(function () { if (isOpen()) render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* 10. #showreel (liens depuis les landings et les pubs) */
  if (location.hash === '#showreel') setTimeout(openReel, 400);
  addEventListener('hashchange', function () { if (location.hash === '#showreel') openReel(); });

  build();
  window.DS_PANELS = { open: open, close: close, items: allItems, isOpen: isOpen };
})();
