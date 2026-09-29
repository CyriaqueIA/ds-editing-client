/* ============================================================
   DS Editing — ajouts à la page du designer (js/ds-app.js reste intact)
   1. Placeholders bilingues (data-ph-en / data-ph-fr)
   2. Notifications (toasts)
   3. Formulaire de contact → FormSubmit (même envoi que l'ancien site)
   (Les fenêtres sur place — vidéos, services, studios, portfolio privé, #showreel — sont dans js/ds-panels.js.)
   ============================================================ */
(function () {
  'use strict';
  var lang = function () { return document.documentElement.lang === 'fr' ? 'fr' : 'en'; };

  /* 1. placeholders bilingues */
  function placeholders() {
    var l = lang();
    document.querySelectorAll('[data-ph-en]').forEach(function (el) { el.placeholder = l === 'fr' ? el.dataset.phFr : el.dataset.phEn; });
  }
  new MutationObserver(placeholders)
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  placeholders();

  /* 2. toasts */
  function toast(msg, type) {
    var root = document.getElementById('toast-root');
    if (!root) { root = document.createElement('div'); root.id = 'toast-root'; document.body.appendChild(root); }
    var t = document.createElement('div'); t.className = 'toast ' + (type || ''); t.textContent = msg; root.appendChild(t);
    setTimeout(function () { t.remove(); }, 4500);
  }

  /* 3. formulaire de contact (FormSubmit : au premier envoi, contact@ds-editing.com reçoit un mail « Activate » à cliquer une fois) */
  var ENDPOINT = 'https://formsubmit.co/ajax/contact@ds-editing.com';
  var T = {
    fr: { err: 'Merci de remplir nom, email et message.', sending: 'Envoi…', ok: 'Envoyé ! Réponse sous 24h.', fail: 'Une erreur est survenue. Réessayez.' },
    en: { err: 'Please fill name, email and message.', sending: 'Sending…', ok: 'Sent! We’ll reply within 24 hours.', fail: 'Something went wrong. Please try again.' }
  };
  document.addEventListener('submit', function (ev) {
    var form = ev.target.closest('#contact-form'); if (!form) return;
    ev.preventDefault();
    var e = T[lang()], data = Object.fromEntries(new FormData(form).entries());
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) { toast(e.err, 'error'); return; }
    var btn = form.querySelector('button[type="submit"]'), label = btn.querySelector('.js-submit-label');
    var restore = function () { btn.disabled = false; label.innerHTML = lang() === 'fr' ? label.dataset.fr : (label.dataset.en || label.dataset.fr); };
    btn.disabled = true; label.textContent = e.sending;
    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, studio: data.studio || '', project_type: data.project_type, message: data.message, _subject: 'Nouveau brief — site DS Editing (' + data.project_type + ')' })
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); toast(e.ok, 'success'); form.reset(); })
      .catch(function () { toast(e.fail, 'error'); })
      .then(restore);
  });
})();
