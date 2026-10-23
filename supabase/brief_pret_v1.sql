-- brief_pret_v1.sql — Option « J'ai déjà mon brief » dans l'espace de dépôt (décisions du QCM du 21/10/2026).
-- À appliquer dans le SQL Editor de Supabase (projet xkanmjlpysxpohsuqvwg), d'un bloc.
--
-- Ce que ça change :
--  1. un bucket privé « briefs » où le client dépose son document (PDF, Word, image, texte), 25 Mo max par fichier ;
--  2. le formulaire (clé publique, pas de session) a le droit d'ÉCRIRE dans ce bucket, jamais de lire ni d'écraser :
--     chemin imposé « slug-du-client/identifiant/nom-du-fichier » ;
--  3. create_order accepte une commande SANS lien de rushes quand details.brief_mode = 'own' : le robot des 10 minutes
--     (ds-editing-ops/depots/brief-robot.mjs) lit le document, en sort le brief FR/EN/ID, les liens de rushes et la date,
--     puis l'accueil normal (dossier Drive, Google Doc, mails) se poursuit. Les liens signés (30 jours) vers les fichiers
--     sont posés par le robot dans details.brief_files[].url pour le dashboard, le mail des monteurs et le PC de Bali.

-- ------------------------------------------------------------------ 1. bucket privé
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('briefs', 'briefs', false, 26214400,
        array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
              'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'text/plain', 'text/markdown'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- ------------------------------------------------------------------ 2. dépôt par la clé publique : INSERT seulement
-- Pas de SELECT, UPDATE ni DELETE pour anon : un fichier déposé n'est ni lisible ni modifiable depuis le site.
-- Seule la clé service (robot) lit le bucket et fabrique des liens signés.
drop policy if exists briefs_depot_insert on storage.objects;
create policy briefs_depot_insert on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'briefs' and name ~ '^[a-z0-9-]{1,60}/[a-z0-9]{8,40}/[^/]{1,180}$');

-- ------------------------------------------------------------------ 3. create_order : rushes facultatifs si brief fourni
-- Copie de orders_v1.sql, deux ajouts : (a) brief_mode = 'own' → rushes vides acceptés (le robot les lira dans le brief) ;
-- (b) brief_mode = 'own' sans aucun fichier ni lien de brief → erreur 'no_brief'.
create or replace function create_order(p_slug text, p_key text, p_order jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  s studios%rowtype; t text; v_links text[]; v_refs text[]; v_email text; v_project text; v_deadline date; n int;
  v_own boolean;
begin
  -- 23/10 : clause clé interne (studio_codes_v1) conservée ; la version du 21/10 l'avait perdue → Putu bloqué (voir ds-editing-os/supabase/create_order_v3.sql)
  select * into s from studios where slug = lower(coalesce(p_slug, '')) and length(coalesce(p_key, '')) >= 8 and (access_token = p_key or id = internal_key_studio(p_key));
  if s.id is null then raise exception 'bad_key'; end if;
  v_email := trim(coalesce(p_order->>'email', ''));
  if v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then raise exception 'bad_email'; end if;
  v_project := left(trim(coalesce(p_order->>'project', '')), 200);
  if length(v_project) = 0 then raise exception 'no_project'; end if;
  v_own := coalesce(p_order->'details'->>'brief_mode', '') = 'own';
  if v_own and jsonb_array_length(coalesce(p_order->'details'->'brief_files', '[]'::jsonb)) + jsonb_array_length(coalesce(p_order->'details'->'brief_links', '[]'::jsonb)) = 0 then
    raise exception 'no_brief';
  end if;
  select array_agg(x) into v_links from jsonb_array_elements_text(coalesce(p_order->'rushes_links', '[]'::jsonb)) x where x ~* '^https?://';
  if v_links is null and v_own then v_links := '{}'::text[]; end if;   -- brief fourni : les rushes sont dedans, le robot les lit
  if v_links is null or array_length(v_links, 1) > 30 then raise exception 'no_rushes'; end if;
  select array_agg(x) into v_refs from jsonb_array_elements_text(coalesce(p_order->'references_links', '[]'::jsonb)) x where x ~* '^https?://';
  if coalesce((p_order->>'terms_accepted')::boolean, false) is not true then raise exception 'terms'; end if;
  select count(*) into n from jobs where studio_id = s.id and created_at > now() - interval '1 hour';
  if n >= 10 then raise exception 'rate_limit'; end if;
  if coalesce(p_order->>'deadline', '') ~ '^\d{4}-\d{2}-\d{2}$' then v_deadline := (p_order->>'deadline')::date; end if;
  t := new_job_token();
  insert into jobs (token, source, client_slug, client_name, studio_id, project, lang, email, contact, work_to_do, details,
                    rushes_links, references_links, logos, description, requested_deadline)
  values (t, 'espace', s.slug, coalesce(s.form_client, s.name), s.id, v_project,
          case when p_order->>'lang' in ('fr', 'en') then p_order->>'lang' else coalesce(s.lang, 'fr') end,
          v_email, left(p_order->>'contact', 300), left(p_order->>'work_to_do', 500),
          coalesce(p_order->'details', '{}'::jsonb) || jsonb_build_object('terms', jsonb_build_object('accepted_at', now(), 'text', left(p_order->>'terms_text', 300))),
          v_links, coalesce(v_refs, '{}'), left(p_order->>'logos', 1000), left(p_order->>'description', 8000), v_deadline);
  return jsonb_build_object('token', t, 'client', coalesce(s.form_client, s.name));
end $$;
grant execute on function create_order(text, text, jsonb) to anon, authenticated;

-- ------------------------------------------------------------------ vérification (à lire après exécution)
select id, public, file_size_limit from storage.buckets where id = 'briefs';
select policyname from pg_policies where tablename = 'objects' and policyname = 'briefs_depot_insert';
