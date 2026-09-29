// Moteur commun des landings de services : textes FR/EN, exemples depuis portfolio.js, formulaire de contact.
(function () {
  const slug = document.body.dataset.service;
  const S = window.DS_SERVICES.find((x) => x.slug === slug);
  const UI = window.DS_SERVICES_UI;
  const P = window.DS_PORTFOLIO;
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  let lang = params.get("lang") || (() => { try { return localStorage.getItem("ds_lang"); } catch { return null; } })() || ((navigator.language || "en").slice(0, 2) === "fr" ? "fr" : "en");
  if (!UI[lang]) lang = "en";
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/contact@ds-editing.com";

  function render() {
    const s = S[lang], u = UI[lang];
    document.documentElement.lang = lang;
    document.title = `DS Editing — ${s.nav}`;
    document.querySelectorAll("[data-s]").forEach((el) => { el.textContent = s[el.dataset.s] || ""; });
    document.querySelectorAll("[data-ui]").forEach((el) => { const v = u[el.dataset.ui]; if (typeof v === "string") el.textContent = v; });
    document.querySelectorAll("[data-ph]").forEach((el) => { el.placeholder = u.form[el.dataset.ph] || ""; });
    $("#langBtn").textContent = lang === "fr" ? "EN" : "FR";
    $("#deliver").innerHTML = s.deliver.map((d) => `<li><span>${d}</span></li>`).join("");
    $("#steps").innerHTML = u.steps.map((st, i) => `<li><span class="n">0${i + 1}</span><div><b>${st[0]}</b><p>${st[1]}</p></div></li>`).join("");
    // exemples : vidéos du portfolio pour ce service (3 max), sinon emplacements
    const cats = slug === "autres" ? ["ia", "miniatures", "trailers"] : [slug];
    const items = (P.items || []).filter((it) => cats.includes(it.cat)).slice(0, 3);
    const vert = slug === "reels-shorts";
    $("#examples").innerHTML = items.length
      ? items.map((it, i) => `<a class="ex ${vert ? "vert" : ""}" data-i="${i}"><img src="${window.dsThumb(it)}" alt=""/><div class="play"><i>▶</i></div><div class="cap"><b>${it.title || ""}</b><span>${studioName(it)}</span></div></a>`).join("")
      : [0, 1, 2].map(() => `<div class="ex ${vert ? "vert" : ""} soon">${u.examplesSoon}</div>`).join("");
    $("#examples").querySelectorAll("[data-i]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openItem(items[+a.dataset.i]); }));
    // studios avec accord
    const ok = (P.studios || []).filter((st) => st.ok);
    $("#trust").hidden = !ok.length;
    $("#studios").innerHTML = ok.map((st) => st.url ? `<a href="${st.url}" target="_blank" rel="noopener">${st.name}</a>` : `<span>${st.name}</span>`).join("");
    // autres services
    $("#other").innerHTML = window.DS_SERVICES.filter((x) => x.slug !== slug).map((x) => `<a href="${x.slug}.html?lang=${lang}">${x[lang].nav}</a>`).join("");
  }
  function studioName(it) { const st = (P.studios || []).find((x) => x.name === it.studio); return st && st.ok ? it.studio : ""; }
  function openItem(it) {
    const box = $("#modalFrame").parentNode;
    box.querySelectorAll("video").forEach((v) => v.remove());
    if (it.src) { // mp4 hébergé
      const v = document.createElement("video"); v.src = it.src; v.controls = true; v.autoplay = true; v.playsInline = true; v.poster = it.poster || ""; v.setAttribute("controlsList", "nodownload noplaybackrate noremoteplayback"); v.disablePictureInPicture = true; v.disableRemotePlayback = true; v.addEventListener("contextmenu", (e) => e.preventDefault()); v.muted = false; v.volume = 1;
      v.style.cssText = "display:block;width:100%;aspect-ratio:16/9;background:#000;max-height:80vh";
      $("#modalFrame").style.display = "none"; box.appendChild(v);
    } else {
      const em = window.dsEmbed(it.url);
      if (!em) { window.open(it.url, "_blank", "noopener"); return; }
      $("#modalFrame").style.display = "block"; $("#modalFrame").src = em;
    }
    $("#modalTitle").textContent = it.title || ""; $("#modal").classList.add("open");
  }
  const closeModal = () => { $("#modal").classList.remove("open"); $("#modalFrame").src = ""; $("#modalFrame").parentNode.querySelectorAll("video").forEach((v) => v.remove()); };
  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  $("#langBtn").addEventListener("click", () => { lang = lang === "fr" ? "en" : "fr"; try { localStorage.setItem("ds_lang", lang); } catch {} render(); });

  $("#lead").addEventListener("submit", async (e) => {
    e.preventDefault();
    const u = UI[lang]; const f = e.target; const msg = $("#msg");
    const data = { name: f.name.value.trim(), email: f.email.value.trim(), studio: f.studio.value.trim(), message: f.message.value.trim(), service: S[lang].nav, page: location.href, _subject: `Lead site — ${S[lang].nav} — ${f.name.value.trim()}` };
    if (!data.name || !data.email) { msg.className = "msg err"; msg.textContent = u.form.name + " · " + u.form.email; return; }
    const btn = f.querySelector("button"); btn.disabled = true;
    try {
      const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(r.status);
      msg.className = "msg ok"; msg.textContent = u.form.sent; f.reset();
    } catch { msg.className = "msg err"; msg.textContent = u.form.error; }
    btn.disabled = false;
  });

  render();
})();
