/* ============================================================
   DS Editing — calendrier maison de réservation de l'appel de closing
   Tous les boutons .js-book de l'accueil ouvrent une fenêtre sur place (délégation sur document :
   des boutons sont aussi ajoutés dynamiquement par js/ds-panels.js).
   1. jour + créneau, affichés dans le fuseau du visiteur (heure de Paris en petit)
   2. coordonnées (champs .cf-in de la charte)
   3. confirmation : Google Agenda + fichier .ics généré ici
   Données : Supabase, RPC anonymes booking_availability / book_slot (ds-editing-os/supabase/bookings_v1.sql).
   E-mails de confirmation (prospect + équipe, .ics) et rappel la veille : ds-editing-ops/depots/poll.mjs.
   Le SDK Supabase est chargé à la demande (import() dynamique) ; clé publique uniquement.
   ============================================================ */
(function () {
  'use strict';
  var SB_URL = 'https://xkanmjlpysxpohsuqvwg.supabase.co';
  var SB_KEY = 'sb_publishable_lIZtV_WtN5NcGSb0dnfaiQ_AgKYBIVa'; /* clé publique (anon) : les règles sont dans les RPC + RLS */
  var SB_SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/+esm';
  var HOST_PHOTO = 'ds-media/team2/cyriaque2.jpg';
  /* Pile de portraits de la fenêtre : 3 conseillères + l'hôte (conseillere-1/2 = portraits d'illustration générés le 29/09) */
  var TEAM_PHOTOS = ['ds-media/team2/candice-c.jpg', 'ds-media/team2/conseillere-1.jpg', 'ds-media/team2/conseillere-2.jpg', HOST_PHOTO];
  var HOST_TZ = 'Europe/Paris';
  var lang = function () { return document.documentElement.lang === 'fr' ? 'fr' : 'en'; };
  var locale = function () { return lang() === 'fr' ? 'fr-FR' : 'en-GB'; };

  /* ---------- textes (seul endroit où il y a du texte) ---------- */
  var T = {
    fr: {
      close: 'Fermer', kick: 'Appel découverte · {n} min', title: 'Réservons votre appel',
      intro: '{host} vous appelle en visio : vos montages, vos volumes, et la préparation de votre 1er montage offert.',
      withHost: 'Avec {host}', duration: '{n} minutes, sans engagement', meet: 'Visio Google Meet', meetSub: 'le lien arrive par e-mail',
      steps: ['Créneau', 'Coordonnées', 'Confirmation'],
      pickDay: 'Choisissez un jour', pickSlot: 'puis un horaire', noSlotsDay: 'Aucun créneau ce jour-là.',
      noSlots: 'Aucun créneau disponible pour le moment. Écrivez-nous via le formulaire de contact.',
      tzLine: 'Horaires affichés dans votre fuseau : <b>{tz}</b> ({name}).', tzParis: 'Sous chaque horaire : l’heure de Paris.', paris: 'heure de Paris',
      loading: 'Chargement des disponibilités…', offline: 'Le calendrier ne répond pas pour le moment. Écrivez-nous via le formulaire de contact ou à contact@ds-editing.com.',
      contact: 'Aller au formulaire', retry: 'Réessayer', change: 'Modifier', back: 'Retour',
      fName: 'Nom et prénom', fEmail: 'E-mail', fPhone: 'Téléphone (WhatsApp)', fStudio: 'Studio / société', fWebsite: 'Site web ou chaîne', fNotes: 'En deux mots, votre besoin', opt: '(facultatif)',
      phName: 'Jean Dupont', phEmail: 'jean@monstudio.com', phPhone: '+33 6 12 34 56 78', phStudio: 'Mon Studio', phWebsite: 'https://', phNotes: 'Ex. : 4 épisodes de podcast par mois + reels',
      submit: 'Confirmer le rendez-vous', sending: 'Réservation…', privacy: 'Vos coordonnées servent uniquement à organiser cet appel.',
      errRequired: 'Merci de remplir les champs signalés.', errEmail: 'Cette adresse e-mail ne semble pas valide.',
      errTaken: 'Ce créneau vient d’être réservé par quelqu’un d’autre. Choisissez-en un autre.', errGone: 'Ce créneau n’est plus disponible. Choisissez-en un autre.',
      errMany: 'Vous avez déjà deux appels réservés. Écrivez-nous à contact@ds-editing.com pour en changer.', errFail: 'La réservation a échoué. Réessayez, ou écrivez-nous via le formulaire de contact.',
      done: 'C’est réservé !', doneSub: 'Un e-mail de confirmation arrive à <b>{email}</b> avec le lien de l’appel. Vous recevrez aussi un rappel la veille.',
      doneParis: 'soit {t} heure de Paris', ref: 'Référence {token}',
      gcal: 'Ajouter à Google Agenda', ics: 'Télécharger le .ics', icsSub: 'Apple Calendar, Outlook',
      icsTitle: 'Appel DS Editing avec {host}', icsDesc: 'Appel découverte DS Editing ({n} min). Le lien Google Meet est dans votre e-mail de confirmation. Référence : {token}', icsLoc: 'Google Meet (lien par e-mail)',
      today: 'auj.'
    },
    en: {
      close: 'Close', kick: 'Discovery call · {n} min', title: 'Let’s book your call',
      intro: '{host} calls you on video: your edits, your volumes, and how we prepare your first free edit.',
      withHost: 'With {host}', duration: '{n} minutes, no commitment', meet: 'Google Meet video call', meetSub: 'the link comes by email',
      steps: ['Time slot', 'Your details', 'Confirmation'],
      pickDay: 'Pick a day', pickSlot: 'then a time', noSlotsDay: 'No slot available on this day.',
      noSlots: 'No slot available right now. Please reach us through the contact form.',
      tzLine: 'Times shown in your time zone: <b>{tz}</b> ({name}).', tzParis: 'Under each time: Paris time.', paris: 'Paris time',
      loading: 'Loading availability…', offline: 'The calendar is not responding right now. Please use the contact form or write to contact@ds-editing.com.',
      contact: 'Go to the contact form', retry: 'Try again', change: 'Change', back: 'Back',
      fName: 'Full name', fEmail: 'Email', fPhone: 'Phone (WhatsApp)', fStudio: 'Studio / company', fWebsite: 'Website or channel', fNotes: 'In a few words, what you need', opt: '(optional)',
      phName: 'John Smith', phEmail: 'john@mystudio.com', phPhone: '+1 305 555 0100', phStudio: 'My Studio', phWebsite: 'https://', phNotes: 'E.g. 4 podcast episodes a month + reels',
      submit: 'Confirm the call', sending: 'Booking…', privacy: 'Your details are only used to set up this call.',
      errRequired: 'Please fill in the highlighted fields.', errEmail: 'This email address doesn’t look valid.',
      errTaken: 'Someone just booked this slot. Please pick another one.', errGone: 'This slot is no longer available. Please pick another one.',
      errMany: 'You already have two calls booked. Write to contact@ds-editing.com to change them.', errFail: 'The booking failed. Please try again, or use the contact form.',
      done: 'You’re booked!', doneSub: 'A confirmation email is on its way to <b>{email}</b> with the call link. You’ll also get a reminder the day before.',
      doneParis: 'that is {t} Paris time', ref: 'Reference {token}',
      gcal: 'Add to Google Calendar', ics: 'Download .ics', icsSub: 'Apple Calendar, Outlook',
      icsTitle: 'DS Editing call with {host}', icsDesc: 'DS Editing discovery call ({n} min). The Google Meet link is in your confirmation email. Reference: {token}', icsLoc: 'Google Meet (link by email)',
      today: 'today'
    }
  };
  var t = function (k) { return T[lang()][k]; };
  var fill = function (s, vars) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; }); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- fuseaux horaires (sans bibliothèque) ---------- */
  var visitorTz = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || HOST_TZ; } catch (e) { return HOST_TZ; } })();
  var fmtCache = {};
  function partsIn(ms, tz) {
    var f = fmtCache[tz];
    if (!f) f = fmtCache[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short' });
    var o = {}; f.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, m: +o.month, d: +o.day, hh: (+o.hour) % 24, mm: +o.minute, ss: +o.second, dow: String(o.weekday).slice(0, 3).toLowerCase() };
  }
  function tzOffset(ms, tz) { var p = partsIn(ms, tz); return (Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm, p.ss) - ms) / 60000; }
  function zonedToUtc(y, m, d, hh, mm, tz) { var g = Date.UTC(y, m - 1, d, hh, mm); var o1 = tzOffset(g, tz); var r = g - o1 * 60000; var o2 = tzOffset(r, tz); if (o2 !== o1) r = g - o2 * 60000; return r; }
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var dayKey = function (p) { return p.y + '-' + pad(p.m) + '-' + pad(p.d); };
  var hm = function (s) { var a = String(s || '').split(':'); return (+a[0] || 0) * 60 + (+a[1] || 0); };
  function tzName(ms, tz) { try { var ps = new Intl.DateTimeFormat(locale(), { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date(ms)); for (var i = 0; i < ps.length; i++) if (ps[i].type === 'timeZoneName') return ps[i].value; } catch (e) {} return ''; }
  var fmtTime = function (ms, tz) { return new Date(ms).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', timeZone: tz }); };
  var fmtDay = function (ms, tz, opts) { return new Date(ms).toLocaleDateString(locale(), Object.assign({ timeZone: tz }, opts)); };
  var sameClock = function (ms) { return tzOffset(ms, visitorTz) === tzOffset(ms, HOST_TZ); };

  /* ---------- disponibilités → créneaux ---------- */
  function isBlocked(list, day, local) {
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      if (typeof b === 'string') {
        var s = b.trim();
        if (s.length === 10 && s === day) return true;
        if (s.length === 21 && s.charAt(10) === '/' && day >= s.slice(0, 10) && day <= s.slice(11)) return true;
      } else if (b && b.from && b.to) {
        var from = String(b.from).replace(' ', 'T').slice(0, 16), to = String(b.to).replace(' ', 'T').slice(0, 16);
        if (local >= from && local < to) return true;
      }
    }
    return false;
  }
  function buildSlots(av) {
    var slot = +av.slot_minutes || 30, now = av.now ? new Date(av.now).getTime() : Date.now(); if (isNaN(now)) now = Date.now();
    var horizon = +av.horizon_days || 21, minStart = now + (+av.lead_hours || 0) * 3600000, maxStart = now + horizon * 86400000;
    var taken = {}; (av.taken || []).forEach(function (s) { taken[new Date(s).getTime()] = 1; });
    var blocked = Array.isArray(av.blocked) ? av.blocked : [], weekly = av.weekly || {}, out = [];
    for (var i = 0; i <= horizon + 1; i++) {
      var p = partsIn(now + i * 86400000, HOST_TZ), ranges = weekly[p.dow] || [], day = dayKey(p);
      for (var r = 0; r < ranges.length; r++) {
        var rs = hm(ranges[r][0]), re = hm(ranges[r][1]);
        for (var m = rs; m + slot <= re; m += slot) {
          var ms = zonedToUtc(p.y, p.m, p.d, Math.floor(m / 60), m % 60, HOST_TZ);
          if (ms < minStart || ms > maxStart || taken[ms]) continue;
          if (isBlocked(blocked, day, day + 'T' + pad(Math.floor(m / 60)) + ':' + pad(m % 60))) continue;
          out.push(ms);
        }
      }
    }
    out.sort(function (a, b) { return a - b; });
    return out;
  }

  /* ---------- état + Supabase ---------- */
  var state = { step: 1, av: null, avAt: 0, slots: [], byDay: {}, day: null, slot: null, booked: null, loading: false, error: null, notice: null, sending: false };
  var root, main, sbClient = null, sbLoading = null, lastFocus = null;
  function sbLoad() {
    if (sbClient) return Promise.resolve(sbClient);
    if (!sbLoading) sbLoading = import(SB_SDK).then(function (m) { sbClient = m.createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } }); return sbClient; }).catch(function (e) { sbLoading = null; throw e; });
    return sbLoading;
  }
  function rpc(name, args) { return sbLoad().then(function (c) { return c.rpc(name, args); }).then(function (res) { if (res.error) throw res.error; return res.data; }); }
  var isoDate = function (ms) { return dayKey(partsIn(ms, HOST_TZ)); };
  function loadAvailability() {
    state.loading = true; state.error = null; render();
    var horizon = 31;
    rpc('booking_availability', { p_from: isoDate(Date.now()), p_to: isoDate(Date.now() + horizon * 86400000) }).then(function (av) {
      if (!av || typeof av !== 'object') throw new Error('empty');
      HOST_TZ = av.timezone || HOST_TZ; state.av = av; state.avAt = Date.now(); state.slots = buildSlots(av);
      state.byDay = {}; state.slots.forEach(function (ms) { var k = dayKey(partsIn(ms, visitorTz)); (state.byDay[k] = state.byDay[k] || []).push(ms); });
      if (!state.day || !state.byDay[state.day]) { var keys = Object.keys(state.byDay).sort(); state.day = keys[0] || null; }
      state.loading = false; paintSide(); render();
    }).catch(function () { state.loading = false; state.error = 'offline'; render(); });
  }

  /* ---------- markup ---------- */
  function mount() {
    root = document.createElement('div'); root.className = 'ds-bk'; root.id = 'ds-bk'; root.hidden = true;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'ds-bk-title');
    root.innerHTML = '<div class="ds-bk-bg" data-bk-close></div><div class="ds-bk-card" tabindex="-1">' +
      '<button type="button" class="ds-bk-x" data-bk-close aria-label="">×</button>' +
      '<div class="ds-bk-grid"><aside class="ds-bk-side"><div class="ds-bk-team">' + TEAM_PHOTOS.map(function (src) { return '<img src="' + src + '" alt="">'; }).join('') + '</div>' +
      '<div class="ds-bk-kick" id="ds-bk-kick"></div><h3 class="ds-bk-title" id="ds-bk-title"></h3><p class="ds-bk-intro" id="ds-bk-intro"></p>' +
      '<ul class="ds-bk-meta"><li id="ds-bk-with"></li><li id="ds-bk-dur"></li><li id="ds-bk-meet"></li></ul></aside>' +
      '<div class="ds-bk-main"><div class="ds-bk-steps" id="ds-bk-steps"></div><div id="ds-bk-main"></div></div></div></div>';
    var anchor = null;
    for (var n = document.body.firstChild; n; n = n.nextSibling) { if (n.nodeType === 8 && /@booking/.test(n.nodeValue)) { anchor = n; break; } }
    if (anchor) anchor.parentNode.insertBefore(root, anchor.nextSibling); else document.body.appendChild(root);
    main = root.querySelector('#ds-bk-main');
    root.addEventListener('click', function (e) { if (e.target.closest('[data-bk-close]')) close(); });
    paintSide();
  }
  function paintSide() {
    var av = state.av || {}, host = av.host_name || 'Cyriaque', n = av.slot_minutes || 30;
    root.querySelector('.ds-bk-x').setAttribute('aria-label', t('close'));
    root.querySelector('#ds-bk-kick').textContent = fill(t('kick'), { n: n });
    root.querySelector('#ds-bk-title').textContent = t('title');
    root.querySelector('#ds-bk-intro').textContent = fill(t('intro'), { host: host });
    root.querySelector('#ds-bk-with').textContent = fill(t('withHost'), { host: host });
    root.querySelector('#ds-bk-dur').textContent = fill(t('duration'), { n: n });
    root.querySelector('#ds-bk-meet').innerHTML = esc(t('meet')) + '<small>' + esc(t('meetSub')) + '</small>';
  }
  function paintSteps() {
    var names = t('steps');
    root.querySelector('#ds-bk-steps').innerHTML = names.map(function (nm, i) {
      var s = i + 1, cls = s === state.step ? 'on' : s < state.step ? 'done' : '';
      return '<span class="' + cls + '"><i>' + (s < state.step ? '✓' : s) + '</i><em>' + esc(nm) + '</em></span>';
    }).join('');
  }

  /* ---------- rendu des étapes ---------- */
  function render() {
    if (!root) return;
    paintSteps();
    if (state.error) return renderError();
    if (state.loading) { main.innerHTML = '<div class="ds-bk-state"><div class="ds-bk-spin"></div><div>' + esc(t('loading')) + '</div></div>'; return; }
    if (state.step === 1) renderSlots(); else if (state.step === 2) renderForm(); else renderDone();
  }
  function renderError() {
    main.innerHTML = '<div class="ds-bk-state"><div>' + esc(t('offline')) + '</div><div class="ds-bk-actions"><a class="btn btn-ac" href="#contact" data-bk-close>' + esc(t('contact')) + '</a><button type="button" class="btn btn-line" data-bk-retry>' + esc(t('retry')) + '</button></div></div>';
    main.querySelector('[data-bk-retry]').addEventListener('click', loadAvailability);
  }
  function renderSlots() {
    var av = state.av || {}, now = Date.now(), horizon = +av.horizon_days || 21, html = '';
    if (state.notice) { html += '<div class="ds-bk-notice">' + esc(t(state.notice)) + '</div>'; }
    if (!state.slots.length) {
      html += '<div class="ds-bk-empty">' + esc(t('noSlots')) + '</div><div class="ds-bk-actions" style="margin-top:14px"><a class="btn btn-ac" href="#contact" data-bk-close>' + esc(t('contact')) + '</a></div>';
      main.innerHTML = html; return;
    }
    var todayKey = dayKey(partsIn(now, visitorTz));
    html += '<h4 class="ds-bk-h"><b>' + esc(t('pickDay')) + '</b> · ' + esc(t('pickSlot')) + '</h4><div class="ds-bk-days" id="ds-bk-days">';
    for (var i = 0; i <= horizon; i++) {
      var ms = now + i * 86400000, k = dayKey(partsIn(ms, visitorTz)), has = !!state.byDay[k];
      html += '<button type="button" class="ds-bk-day' + (k === state.day ? ' on' : '') + (k === todayKey ? ' today' : '') + '" data-day="' + k + '"' + (has ? '' : ' disabled') + '>' +
        '<small>' + esc(k === todayKey ? t('today') : fmtDay(ms, visitorTz, { weekday: 'short' })) + '</small><b>' + esc(fmtDay(ms, visitorTz, { day: 'numeric' })) + '</b><small>' + esc(fmtDay(ms, visitorTz, { month: 'short' })) + '</small></button>';
    }
    html += '</div>';
    var list = state.byDay[state.day] || [];
    html += list.length
      ? '<div class="ds-bk-slots">' + list.map(function (ms) { return '<button type="button" class="ds-bk-slot" data-slot="' + ms + '">' + esc(fmtTime(ms, visitorTz)) + (sameClock(ms) ? '' : '<small>' + esc(fmtTime(ms, HOST_TZ)) + ' ' + esc(t('paris')) + '</small>') + '</button>'; }).join('') + '</div>'
      : '<div class="ds-bk-empty">' + esc(t('noSlotsDay')) + '</div>';
    html += '<div class="ds-bk-tz">' + fill(t('tzLine'), { tz: esc(visitorTz.replace(/_/g, ' ')), name: esc(tzName(now, visitorTz)) }) + (sameClock(now) ? '' : ' ' + esc(t('tzParis'))) + '</div>';
    main.innerHTML = html;
    main.querySelectorAll('[data-day]').forEach(function (b) { b.addEventListener('click', function () { state.day = b.dataset.day; state.notice = null; render(); }); });
    main.querySelectorAll('[data-slot]').forEach(function (b) { b.addEventListener('click', function () { state.slot = +b.dataset.slot; state.step = 2; state.notice = null; render(); }); });
    var strip = main.querySelector('#ds-bk-days'), on = strip && strip.querySelector('.on');
    if (on) strip.scrollLeft = Math.max(0, on.offsetLeft - strip.offsetLeft - 8);
  }
  function pickLabel(ms) {
    var when = fmtDay(ms, visitorTz, { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + fmtTime(ms, visitorTz);
    return '<b>' + esc(when) + '</b>' + (sameClock(ms) ? '' : '<small>' + esc(fmtTime(ms, HOST_TZ)) + ' ' + esc(t('paris')) + '</small>');
  }
  var savedForm = {};
  function renderForm() {
    var ms = state.slot, v = savedForm;
    var field = function (name, type, req) {
      var tag = type === 'textarea' ? '<textarea class="cf-in" name="' + name + '" placeholder="' + esc(t('ph' + cap(name))) + '">' + esc(v[name] || '') + '</textarea>'
        : '<input class="cf-in" name="' + name + '" type="' + type + '" placeholder="' + esc(t('ph' + cap(name))) + '" value="' + esc(v[name] || '') + '"' + (name === 'email' ? ' autocomplete="email"' : name === 'name' ? ' autocomplete="name"' : name === 'phone' ? ' autocomplete="tel"' : name === 'studio' ? ' autocomplete="organization"' : name === 'website' ? ' autocomplete="url"' : '') + '>';
      return '<label>' + esc(t('f' + cap(name))) + (req ? '' : ' <em>' + esc(t('opt')) + '</em>') + tag + '</label>';
    };
    main.innerHTML = '<div class="ds-bk-pick">' + pickLabel(ms) + '<button type="button" data-bk-back>' + esc(t('change')) + '</button></div>' +
      '<form class="ds-bk-form" id="ds-bk-form" novalidate>' +
      '<div class="ds-bk-row">' + field('name', 'text', true) + field('email', 'email', true) + '</div>' +
      '<div class="ds-bk-row">' + field('phone', 'tel', true) + field('studio', 'text', true) + '</div>' +
      field('website', 'url', false) + field('notes', 'textarea', false) +
      '<div class="ds-bk-ferr" id="ds-bk-ferr" aria-live="polite"></div>' +
      '<div class="ds-bk-actions"><button type="submit" class="btn btn-ac" id="ds-bk-submit">' + esc(t('submit')) + '</button><button type="button" class="btn btn-line" data-bk-back>' + esc(t('back')) + '</button></div>' +
      '<p class="ds-bk-privacy">' + esc(t('privacy')) + '</p></form>';
    main.querySelectorAll('[data-bk-back]').forEach(function (b) { b.addEventListener('click', function () { rememberForm(); state.step = 1; render(); }); });
    var form = main.querySelector('#ds-bk-form');
    form.addEventListener('input', rememberForm);
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(form); });
    var first = form.querySelector('[name="name"]');
    if (first && !first.value && window.matchMedia && matchMedia('(hover:hover)').matches) first.focus();
  }
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  function rememberForm() { var f = main.querySelector('#ds-bk-form'); if (!f) return; ['name', 'email', 'phone', 'studio', 'website', 'notes'].forEach(function (k) { savedForm[k] = f.elements[k] ? f.elements[k].value : ''; }); }
  function submit(form) {
    if (state.sending) return;
    rememberForm();
    var d = {}; ['name', 'email', 'phone', 'studio', 'website', 'notes'].forEach(function (k) { d[k] = (savedForm[k] || '').trim(); });
    var bad = [];
    if (d.name.length < 2) bad.push('name');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) bad.push('email');
    if (!d.phone) bad.push('phone');
    if (!d.studio) bad.push('studio');
    form.querySelectorAll('.cf-in').forEach(function (i) { i.classList.toggle('bad', bad.indexOf(i.name) >= 0); });
    var err = form.querySelector('#ds-bk-ferr');
    if (bad.length) { err.textContent = bad.length === 1 && bad[0] === 'email' ? t('errEmail') : t('errRequired'); form.querySelector('.cf-in.bad').focus(); return; }
    err.textContent = '';
    var btn = form.querySelector('#ds-bk-submit'); btn.disabled = true; btn.textContent = t('sending'); state.sending = true;
    var slotMs = state.slot;
    rpc('book_slot', { p_starts_at: new Date(slotMs).toISOString(), p_tz: visitorTz, p_name: d.name, p_email: d.email, p_phone: d.phone, p_studio: d.studio, p_website: d.website, p_notes: d.notes, p_lang: lang() })
      .then(function (res) {
        state.sending = false;
        var starts = res && res.starts_at ? new Date(res.starts_at).getTime() : slotMs;
        var ends = res && res.ends_at ? new Date(res.ends_at).getTime() : starts + ((state.av && state.av.slot_minutes) || 30) * 60000;
        state.booked = { token: (res && res.token) || '', starts: starts, ends: ends, email: d.email, name: d.name };
        savedForm = {}; state.step = 3; render();
      })
      .catch(function (e) {
        state.sending = false;
        var code = String((e && e.message) || '');
        if (/slot_taken|too_soon|too_far|outside_hours|blocked|bad_slot/.test(code)) { state.notice = /slot_taken/.test(code) ? 'errTaken' : 'errGone'; state.slot = null; state.step = 1; loadAvailability(); return; }
        if (/too_many/.test(code)) err.textContent = t('errMany');
        else if (/bad_email/.test(code)) err.textContent = t('errEmail');
        else err.textContent = t('errFail');
        btn.disabled = false; btn.textContent = t('submit');
      });
  }
  function renderDone() {
    var b = state.booked, av = state.av || {};
    var when = fmtDay(b.starts, visitorTz, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + fmtTime(b.starts, visitorTz) + ' – ' + fmtTime(b.ends, visitorTz) + ' (' + tzName(b.starts, visitorTz) + ')';
    main.innerHTML = '<div class="ds-bk-done"><div class="ds-bk-check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></div>' +
      '<h4>' + esc(t('done')) + '</h4>' +
      '<div class="ds-bk-when">' + esc(when) + (sameClock(b.starts) ? '' : '<small>' + esc(fill(t('doneParis'), { t: fmtTime(b.starts, HOST_TZ) })) + '</small>') + '</div>' +
      '<p>' + fill(t('doneSub'), { email: esc(b.email) }) + '</p>' +
      '<div class="ds-bk-actions"><a class="btn btn-ac" href="' + esc(gcalUrl(b, av)) + '" target="_blank" rel="noopener">' + esc(t('gcal')) + '</a><button type="button" class="btn btn-line" data-bk-ics>' + esc(t('ics')) + '</button><button type="button" class="btn btn-line" data-bk-close>' + esc(t('close')) + '</button></div>' +
      (b.token ? '<p style="font-size:12px">' + esc(fill(t('ref'), { token: b.token })) + '</p>' : '') + '</div>';
    main.querySelector('[data-bk-ics]').addEventListener('click', function () { downloadIcs(b, av); });
  }

  /* ---------- agenda : Google Agenda + .ics ---------- */
  var icsDate = function (ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  var icsEsc = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); };
  function icsVars(b, av) { return { host: av.host_name || 'Cyriaque', n: av.slot_minutes || 30, token: b.token }; }
  function gcalUrl(b, av) {
    var v = icsVars(b, av);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(fill(t('icsTitle'), v)) + '&dates=' + icsDate(b.starts) + '/' + icsDate(b.ends) +
      '&details=' + encodeURIComponent(fill(t('icsDesc'), v)) + '&location=' + encodeURIComponent(t('icsLoc'));
  }
  function icsText(b, av) {
    var v = icsVars(b, av);
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DS Editing//Booking//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:' + (b.token || icsDate(b.starts)) + '@ds-editing.com', 'DTSTAMP:' + icsDate(Date.now()), 'DTSTART:' + icsDate(b.starts), 'DTEND:' + icsDate(b.ends),
      'SUMMARY:' + icsEsc(fill(t('icsTitle'), v)), 'DESCRIPTION:' + icsEsc(fill(t('icsDesc'), v)), 'LOCATION:' + icsEsc(t('icsLoc')), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  function downloadIcs(b, av) {
    var blob = new Blob([icsText(b, av)], { type: 'text/calendar;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ds-editing-' + (b.token || 'appel') + '.ics'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  /* ---------- ouverture / fermeture ---------- */
  function open() {
    if (!root) mount();
    lastFocus = document.activeElement;
    if (state.step === 3) { state.step = 1; state.booked = null; state.slot = null; }
    root.hidden = false; document.body.style.overflow = 'hidden';
    if (!state.av || Date.now() - state.avAt > 120000) loadAvailability(); else render();
    root.querySelector('.ds-bk-card').focus();
  }
  function close() {
    if (!root || root.hidden) return;
    root.hidden = true; document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  var isOpen = function () { return root && !root.hidden; };
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.js-book') : null; if (!b) return;
    e.preventDefault(); open();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(); });
  new MutationObserver(function () { if (root) { paintSide(); if (isOpen()) { if (state.step === 2) rememberForm(); render(); } } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  window.dsBooking = { open: open, close: close };
})();
