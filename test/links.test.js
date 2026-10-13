/* Tests du filtre de liens de rushes (client/links.js).
   Lancement : node --test test/links.test.js
   Le premier test est l'incident Mediacast du 13/10/2026 : le lien Spotify collé
   dans « Liens des rushes ». S'il repasse, on peut reperdre 156 Go. */
const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("../client/links.js");

const SPOTIFY = "https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk";

test("le lien Spotify de l'incident Mediacast est refusé", () => {
  const r = L.classify(SPOTIFY);
  assert.equal(r.status, "block");
  assert.equal(r.kind, "page");
  assert.equal(r.reason, "page");
  assert.equal(r.label, "Spotify");
  assert.equal(L.blocked(SPOTIFY), true);
});

test("un dossier Google Drive est accepté", () => {
  const r = L.classify("https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv");
  assert.equal(r.status, "ok");
  assert.equal(r.kind, "drive");
});

test("un fichier Google Drive est accepté", () => {
  assert.equal(L.classify("https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv/view?usp=sharing").status, "ok");
});

test("un lien Drive sans identifiant est refusé, avec le message Drive", () => {
  const r = L.classify("https://drive.google.com/drive/u/0/my-drive");
  assert.equal(r.status, "block");
  assert.equal(r.reason, "drive");
});

test("un WeTransfer est accepté (lien long et lien court)", () => {
  assert.equal(L.classify("https://wetransfer.com/downloads/abcdef0123456789abcdef0123456789/0a1b2c").status, "ok");
  assert.equal(L.classify("https://we.tl/t-AbCdEf1234").status, "ok");
});

test("SwissTransfer et Dropbox sont acceptés", () => {
  assert.equal(L.classify("https://www.swisstransfer.com/d/0a1b2c3d-4e5f-6071-8293-a4b5c6d7e8f9").status, "ok");
  assert.equal(L.classify("https://www.dropbox.com/scl/fo/abc123/AAA?rlkey=xyz&dl=0").status, "ok");
});

test("un Frame.io passe avec avertissement, pas bloqué", () => {
  const r = L.classify("https://ds-editing.frame.io/projects/abcdef12-3456-7890-abcd-ef1234567890");
  assert.equal(r.status, "warn");
  assert.equal(r.kind, "manual");
  assert.equal(r.label, "Frame.io");
  assert.equal(L.blocked(r.url), false);
});

test("OneDrive, MEGA, iCloud, Google Photos passent avec avertissement", () => {
  for (const u of [
    "https://1drv.ms/f/s!AbCdEf123456",
    "https://mega.nz/folder/AbCdEfGh#iJkLmNoPqRsTuV",
    "https://www.icloud.com/iclouddrive/0abCdEfGhIjK",
    "https://photos.app.goo.gl/AbCdEfGhIjKlMnOp",
  ]) assert.equal(L.classify(u).status, "warn", u);
});

test("une URL cassée est refusée", () => {
  for (const u of ["pas un lien", "htp:/drive.google", "https://", "ftp://serveur/rushes", "https://rushes"]) {
    const r = L.classify(u);
    assert.equal(r.status, "block", u);
    assert.equal(r.reason, "bad", u);
  }
});

/* Décision du 13/10/2026 : un hébergeur qu'on ne connaît pas NE BLOQUE PLUS. Le récupérer à la main coûte
   20 minutes, un client qui n'arrive pas à valider sa commande coûte la commande. */
test("un domaine inconnu sans extension de fichier passe avec avertissement", () => {
  const r = L.classify("https://www.mediacast-studio.fr/espace-rushes");
  assert.equal(r.status, "warn");
  assert.equal(r.reason, "unknown");
  assert.equal(L.blocked("https://www.mediacast-studio.fr/espace-rushes"), false);
});

test("un lien S3 signé sans extension passe avec avertissement", () => {
  const u = "https://mediacast.s3.eu-west-3.amazonaws.com/rushes/ep12?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=0abc";
  const r = L.classify(u);
  assert.equal(r.status, "warn");
  assert.equal(L.blocked(u), false);
});

test("aucun hébergeur ne bloque : seules les pages et les adresses cassées sont refusées", () => {
  const cas = [
    "https://rushes.mon-studio-a-moi.io/dossier/12",
    "https://files.agence-x.co.uk/download/abc123",
    "https://cdn.inconnu.tv/p/9f8e7d",
    "https://nas.studio-mediacast.fr:5001/sharing/aZ9xK",
  ];
  for (const u of cas) {
    assert.equal(L.classify(u).status, "warn", u);
    assert.equal(L.blocked(u), false, u);
  }
});

test("un lien direct vers un fichier est accepté", () => {
  for (const u of [
    "https://cdn.mediacast-studio.fr/rushes/episode-12.mp4",
    "https://files.exemple.com/pack%20rushes/ep12.ZIP",
    "https://s3.eu-west-3.amazonaws.com/bucket/ep12.mov?X-Amz-Signature=abc",
  ]) assert.equal(L.classify(u).status, "ok", u);
});

test("un champ vide ne dit rien (pas d'erreur à l'ouverture du formulaire)", () => {
  assert.equal(L.classify("").status, "empty");
  assert.equal(L.classifyField("   ").status, "empty");
  assert.equal(L.blocked(""), false);
});

test("un lien collé sans https:// est complété avant d'être classé", () => {
  assert.equal(L.normalize("drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv"), "https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv");
  assert.equal(L.classify("open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk").status, "block");
});

test("un champ qui mélange plusieurs liens prend le pire statut", () => {
  const f = L.classifyField("https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv " + SPOTIFY);
  assert.equal(f.status, "block");
  assert.equal(f.label, "Spotify");
  assert.equal(f.items.length, 2);
  assert.equal(f.items[0].status, "ok");
});

test("les plateformes d'écoute et les réseaux sociaux sont tous refusés", () => {
  for (const u of [
    "https://podcasts.apple.com/fr/podcast/mediacast/id1234567890",
    "https://www.deezer.com/fr/show/1234567",
    "https://soundcloud.com/mediacast/episode-12",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://vimeo.com/123456789",
    "https://www.twitch.tv/mediacast",
    "https://www.instagram.com/reel/AbCdEf/",
    "https://www.tiktok.com/@mediacast/video/1234567890",
    "https://podcasters.spotify.com/pod/show/mediacast",
  ]) assert.equal(L.classify(u).status, "block", u);
});
