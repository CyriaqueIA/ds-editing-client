-- brand_files_v1.sql — Logo et capture de palette déposés en FICHIER dans l'espace de dépôt (audit du 23/10/2026).
-- À appliquer dans le SQL Editor de Supabase (projet xkanmjlpysxpohsuqvwg), d'un bloc. Prérequis : brief_pret_v1.sql (bucket « briefs »).
--
-- Constat : depuis le lancement, le formulaire gardait le logo / la palette en mémoire du navigateur et n'envoyait que le texte
-- « Logo: download.png (file attached) ». Aucun fichier n'existait nulle part : les monteurs ne pouvaient rien télécharger.
-- Correctif (client/depot.html + ds-editing-ops/depots/brand-files.mjs) : les fichiers partent dans le bucket privé « briefs »
-- (même politique : clé publique, INSERT seulement, chemin « slug/identifiant/nom »), référencés dans jobs.details.brand_files ;
-- le robot les copie dans le dossier Drive de la commande et pose le lien dans le brief.
--
-- Ce fichier ajoute seulement le SVG (logo vectoriel, accepté par la zone de dépôt) aux types permis du bucket. Rien d'autre à ouvrir :
-- la politique briefs_depot_insert couvre déjà ce chemin, et seule la clé service lit le bucket.
update storage.buckets
   set allowed_mime_types = (select array_agg(distinct x) from unnest(coalesce(allowed_mime_types, '{}'::text[]) || array['image/svg+xml']) x)
 where id = 'briefs';

-- ------------------------------------------------------------------ vérification (à lire après exécution)
select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'briefs';
