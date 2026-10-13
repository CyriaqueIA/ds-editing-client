# Tests du site

Aucune dépendance : le lanceur de tests de Node (`node:test`), rien à installer.

```sh
node --test test/links.test.js
```

## `client/links.js` — filtre des liens de rushes

Classe un lien collé dans le formulaire de dépôt (`client/depot.html`, étape 04 — Fichiers)
en quatre statuts : `ok` (le robot le télécharge seul : Google Drive, SwissTransfer,
WeTransfer, Dropbox, lien direct vers un fichier), `warn` (vrai matériel, récupéré à la
main : Frame.io, OneDrive, MEGA, iCloud, Google Photos, Smash…), `block` (ne peut pas être
des rushes : page Spotify / YouTube / réseau social, domaine inconnu sans fichier, lien
cassé) et `empty`.

Les règles reproduisent celles du robot de téléchargement (`ds-editing-ops/agent-bali/lib/
sources.mjs`, fonction `classify`) : **toute règle ajoutée d'un côté doit l'être de
l'autre**, sinon le formulaire accepte ce que le robot ne sait pas prendre. C'est
exactement ce qui est arrivé le 13/10/2026 (dépôt Mediacast) : un lien Spotify validé
comme des rushes, six tentatives de téléchargement en échec, 156 Go de rushes jetés.

Le champ « Les vidéos dont on doit s'inspirer » n'est PAS filtré : on n'y télécharge rien,
tout lien y est utile au monteur. Un lien refusé dans les rushes peut y être déplacé d'un
clic.
