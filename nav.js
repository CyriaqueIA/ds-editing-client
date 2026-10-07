/* nav.js — le passe-plat entre les espaces DS Editing (07/10/2026).
   Un SEUL endroit où la liste des espaces est écrite. Chaque page ajoute juste :
       <script src="/nav.js" defer></script>
   Ajouter un espace plus tard = une ligne dans ESPACES ci-dessous, et il apparaît partout.

   Où il s'accroche, dans l'ordre : [data-dsnav] → .hd .right (dashboard) → .top (CRM) → coin haut-droit en dernier recours.

   QUI LE VOIT : pas en mode télé (?tv=1), et pas dans la vue personnelle d'un monteur
   (clé « ds_team_key » posée par team/dashboard.html, sauf si la vue admin est ouverte).
   Ce n'est pas une barrière de sécurité — l'accès libre reste ouvert — c'est pour ne pas
   mettre les prix et les prospects sous le nez d'un monteur qui ouvre son lien. */
(function () {
  "use strict";

  var ESPACES = [
    ["CRM — prospects et clients", "/crm/"],
    ["Production — dashboard équipe", "/team/dashboard.html"],
    ["Production direction", "/prod-admin/"],
    ["Rapport du jour — monteurs", "/prod/"],
    ["Entretiens — recrutement", "/entretien/"],
    ["Espace client", "/client/"],
    ["Suivi d'une commande", "/suivi.html"],
    ["Site public", "/"]
  ];

  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // GitHub Pages sert aussi le site sous /ds-editing-client/ : on préfixe pour ne pas tomber à la racine du compte.
  var BASE = /\.github\.io$/i.test(location.hostname) ? "/" + location.pathname.split("/")[1] : "";

  function mount() {
    if (document.querySelector(".dsnav")) return;
    if (/[?&]tv=1\b/.test(location.search)) return;
    if (ls("ds_team_key") && !(Number(ls("ds_admin_until")) > Date.now())) return;

    var css = document.createElement("style");
    css.textContent =
      ".dsnav{position:relative;font:inherit}" +
      ".dsnav>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;" +
      "font-size:13px;font-weight:600;line-height:1;padding:7px 12px;border-radius:999px;" +
      "border:1px solid currentColor;color:inherit;opacity:.75;white-space:nowrap}" +
      ".dsnav>summary::-webkit-details-marker{display:none}" +
      ".dsnav[open]>summary,.dsnav>summary:hover{opacity:1}" +
      ".dsnav>summary::after{content:'';width:5px;height:5px;border-right:1.5px solid currentColor;" +
      "border-bottom:1.5px solid currentColor;transform:rotate(45deg) translate(-1px,-1px)}" +
      ".dsnav .pop{position:absolute;right:0;top:calc(100% + 8px);z-index:999;min-width:252px;padding:6px;" +
      "background:#0d0f12;border:1px solid rgba(255,255,255,.16);border-radius:12px;" +
      "box-shadow:0 18px 48px rgba(0,0,0,.6);display:flex;flex-direction:column;gap:2px}" +
      ".dsnav .pop a{display:block;padding:9px 12px;border-radius:8px;font-size:13.5px;line-height:1.25;" +
      "color:#f4f1ea;text-decoration:none;white-space:nowrap}" +
      ".dsnav .pop a:hover{background:rgba(255,255,255,.09)}" +
      ".dsnav .pop a[aria-current]{color:#9aa0a6;cursor:default;background:none}" +
      ".dsnav .pop a[aria-current]::after{content:' · tu es ici';font-size:11.5px}" +
      "@media(max-width:560px){.dsnav .pop{right:auto;left:0}}";
    document.head.appendChild(css);

    var d = document.createElement("details");
    d.className = "dsnav";
    var s = document.createElement("summary");
    s.textContent = "Espaces";
    d.appendChild(s);

    var pop = document.createElement("div");
    pop.className = "pop";
    // On compare sur le chemin seul : un espace ouvert avec ?k=… ou ?tab=… reste « tu es ici ».
    var here = location.pathname.replace(/index\.html$/, "").replace(/\/+$/, "/") || "/";
    ESPACES.forEach(function (e) {
      var a = document.createElement("a");
      a.textContent = e[0];
      a.href = BASE + e[1];
      var cible = (BASE + e[1]).replace(/index\.html$/, "").replace(/\/+$/, "/") || "/";
      if (cible === here) { a.setAttribute("aria-current", "page"); a.removeAttribute("href"); }
      pop.appendChild(a);
    });
    d.appendChild(pop);

    // Refermer au clic dehors ou sur Échap, sinon le menu reste ouvert derrière la page.
    document.addEventListener("click", function (ev) { if (d.open && !d.contains(ev.target)) d.open = false; });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") d.open = false; });

    var hote = document.querySelector("[data-dsnav]") ||
               document.querySelector(".hd .right") ||
               document.querySelector(".top .who") ||
               document.querySelector(".top");
    if (hote) {
      hote.insertBefore(d, hote.firstChild);
    } else {
      d.style.cssText = "position:fixed;top:12px;right:14px;z-index:999";
      document.body.appendChild(d);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
