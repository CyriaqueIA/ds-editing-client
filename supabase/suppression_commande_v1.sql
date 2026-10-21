-- DS Editing — SUPPRESSION D'UNE COMMANDE v1 (21/10/2026) : bouton « Supprimer la commande » du dashboard équipe, pour une commande PAS COMMENCÉE.
-- Appliquer : coller tel quel dans le SQL Editor de Supabase et lancer (une transaction, rejouable à l'identique).
-- PRÉREQUIS : dashboard_v1 (jobs, my_role), orders_v1 (agent_jobs / agent_report), lot_b_liens (_team_auth), lot_c_parties (job_parts),
--             invoices_v1 (jobs.invoice_id), vue_equipe_v1 (jobs_viewer_block).
--
-- DÉCISIONS (questions à Cyriaque du 21/10/2026) :
--   QUI    : admin, dispatch et qualité (Cyriaque, Sajid, Ghali, Putu, Rania), par compte nominatif ET par lien perso. Jamais un monteur,
--            jamais le lien commun 'viewer', jamais le compte partagé acces.libre@ds-editing.com.
--   QUOI   : seulement une commande PAS COMMENCÉE : aucune étape cochée (démarré / moitié / livré), ni sur la commande ni sur une de ses
--            parties, qualité encore « en attente », aucun lien frame.io, aucune relivraison, pas de facture.
--            Sinon la base refuse : COMMANDE_COMMENCEE ou COMMANDE_FACTUREE (le dashboard traduit ces codes).
--   COMMENT: suppression DÉFINITIVE (la ligne jobs part ; job_parts et editor_feedback suivent par cascade) + JOURNAL jobs_deleted :
--            qui, quand, par quel chemin (compte / lien), et une copie complète de la commande et de ses parties (snapshot) pour la
--            recréer à la main si besoin.
--   PC     : si les rushes étaient déjà sur le PC du bureau (files_path), l'agent reçoit la commande supprimée dans sa liste « purge » au
--            prochain passage et efface le dossier ; il le signale par agent_report(files_purged_at) → jobs_deleted.purged_at.
--   NON RETENU : le dossier Drive reste en place ; aucun e-mail au client.
--
-- ROLLBACK (SQL Editor, dans cet ordre) :
--   drop function if exists team_job_delete(text, uuid); drop function if exists job_delete(uuid); drop function if exists _job_delete_apply(uuid, text, text);
--   drop table if exists jobs_deleted;
--   rejouer les blocs agent_jobs et agent_report de orders_v1.sql (versions sans la purge des supprimées) ; notify pgrst, 'reload schema';

-- ------------------------------------------------------------------ 1. journal des commandes supprimées
create table if not exists jobs_deleted (
  job_id uuid primary key,                                          -- ancien jobs.id (l'agent du PC s'en sert pour signaler la purge)
  token text not null,
  client_name text not null,
  project text not null,
  studio_id uuid,
  source text,                                                      -- form / espace / manual
  files_path text,                                                  -- dossier de rushes encore sur le PC du bureau au moment de la suppression (sinon null)
  drive_folder_id text,
  folder_url text,
  created_at timestamptz,                                           -- date de la commande
  deleted_at timestamptz not null default now(),
  deleted_by text not null,                                         -- « Putu », « Cyriaque »…
  deleted_via text not null check (deleted_via in ('account', 'link')),
  snapshot jsonb not null,                                          -- {job: ligne jobs complète, parts: [job_parts]}
  purged_at timestamptz                                             -- dossier de rushes effacé du PC du bureau (agent_report)
);
-- @@
comment on table jobs_deleted is 'Journal des commandes supprimées depuis le dashboard (suppression_commande_v1.sql). Lecture : admin / dispatch / qualité. Écriture : fonctions seulement.';
-- @@
create index if not exists jobs_deleted_purge_idx on jobs_deleted (purged_at) where files_path is not null and purged_at is null;
-- @@
alter table jobs_deleted enable row level security;
-- @@
drop policy if exists jobs_deleted_read_team on jobs_deleted;
-- @@
create policy jobs_deleted_read_team on jobs_deleted for select to authenticated using (my_role() in ('admin', 'dispatcher', 'qc'));
-- @@
grant select on jobs_deleted to authenticated;
-- @@

-- ------------------------------------------------------------------ 2. cœur : vérifie, journalise, supprime (interne, jamais exposé)
create or replace function _job_delete_apply(p_job uuid, p_by text, p_via text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare j jobs; v_parts jsonb; v_path text;
begin
  select * into j from jobs where id = p_job;
  if j.id is null then raise exception 'INTROUVABLE'; end if;
  if j.invoice_id is not null then raise exception 'COMMANDE_FACTUREE'; end if;
  if j.started_at is not null or j.half_at is not null or j.delivered_at is not null
     or j.qc_status <> 'pending' or coalesce(j.qc_round, 0) > 0 or j.parts_ready_at is not null
     or coalesce(btrim(j.frameio_url), '') <> ''
     or exists (select 1 from job_parts p where p.job_id = j.id
                  and (p.started_at is not null or p.half_at is not null or p.delivered_at is not null or coalesce(btrim(p.frameio_url), '') <> ''))
  then raise exception 'COMMANDE_COMMENCEE'; end if;
  select coalesce(jsonb_agg(to_jsonb(p) order by p.sort), '[]'::jsonb) into v_parts from job_parts p where p.job_id = j.id;
  v_path := case when j.files_purged_at is null then nullif(btrim(j.files_path), '') end;
  insert into jobs_deleted (job_id, token, client_name, project, studio_id, source, files_path, drive_folder_id, folder_url, created_at, deleted_by, deleted_via, snapshot)
  values (j.id, j.token, j.client_name, j.project, j.studio_id, j.source, v_path, j.drive_folder_id, j.folder_url, j.created_at,
          left(coalesce(nullif(btrim(p_by), ''), '?'), 80), p_via, jsonb_build_object('job', to_jsonb(j), 'parts', v_parts));
  delete from jobs where id = j.id;
  return jsonb_build_object('ok', true, 'token', j.token, 'files_on_pc', v_path is not null);
end $$;
-- @@
revoke all on function _job_delete_apply(uuid, text, text) from public, anon, authenticated;
-- @@

-- ------------------------------------------------------------------ 3. compte nominatif (admin / dispatch / qualité) — jamais le compte partagé
create or replace function job_delete(p_job uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_role text; v_name text; v_email text;
begin
  if v_uid is null then raise exception 'REFUSE'; end if;
  select p.role::text, p.display_name into v_role, v_name from profiles p where p.id = v_uid;
  if v_role is null or v_role not in ('admin', 'dispatcher', 'qc') then raise exception 'REFUSE'; end if;
  select u.email into v_email from auth.users u where u.id = v_uid;
  if lower(coalesce(v_email, '')) = 'acces.libre@ds-editing.com' then raise exception 'REFUSE'; end if;   -- compte partagé « Équipe » : jamais
  return _job_delete_apply(p_job, coalesce(nullif(btrim(v_name), ''), v_email), 'account');
end $$;
-- @@
revoke all on function job_delete(uuid) from public, anon;
-- @@
grant execute on function job_delete(uuid) to authenticated;
-- @@

-- ------------------------------------------------------------------ 4. lien perso (Putu · dispatch, Rania · qualité) — ni monteur ni lien commun
create or replace function team_job_delete(p_key text, p_job uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a record;
begin
  select * into a from _team_auth(p_key);
  if a.o_err is not null then return jsonb_build_object('error', a.o_err); end if;
  if a.o_role not in ('dispatcher', 'qc') then raise exception 'REFUSE'; end if;
  perform set_config('ds.team_role', a.o_role, true);   -- jobs_viewer_block lit ce rôle ; 'viewer' n'arrive jamais ici
  return _job_delete_apply(p_job, split_part(a.o_label, ' · ', 1), 'link');
end $$;
-- @@
revoke all on function team_job_delete(text, uuid) from public;
-- @@
grant execute on function team_job_delete(text, uuid) to anon, authenticated, service_role;
-- @@

-- ------------------------------------------------------------------ 5. PC du bureau : les dossiers des commandes supprimées entrent dans la liste « purge »
-- (même fonction que orders_v1.sql, + union sur jobs_deleted ; les listes « download » et « refresh » ne changent pas)
create or replace function agent_jobs(p_token text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare st agent_settings%rowtype;
begin
  if not agent_ok(p_token) then raise exception 'bad_agent_token'; end if;
  select * into st from agent_settings where id = 1;
  return jsonb_build_object(
    'settings', jsonb_build_object('dest_root', st.dest_root, 'cleanup_days', st.cleanup_days, 'disk_alert_pct', st.disk_alert_pct),
    'download', coalesce((select jsonb_agg(x order by x.requested_deadline asc nulls last, x.created_at asc) from (
        select j.id, j.token, j.client_name, j.project, j.lang, j.rushes_links, j.references_links, j.logos, j.details, j.description,
               j.brief_url, j.work_to_do, j.editor_names, j.requested_deadline, j.created_at, j.download_attempts, j.download_error
        from jobs j where j.files_downloaded_at is null and j.intake_done_at is not null and j.files_purged_at is null
          and coalesce(j.download_error, '') not like '[abandon]%') x), '[]'::jsonb),
    'refresh', coalesce((select jsonb_agg(jsonb_build_object('id', j.id, 'token', j.token, 'client_name', j.client_name, 'project', j.project,
        'files_path', j.files_path, 'editor_names', j.editor_names, 'work_to_do', j.work_to_do, 'requested_deadline', j.requested_deadline))
        from jobs j where j.files_downloaded_at is not null and j.files_path is not null and j.files_purged_at is null and j.qc_status <> 'ok'), '[]'::jsonb),
    'purge', coalesce((select jsonb_agg(jsonb_build_object('id', x.id, 'token', x.token, 'files_path', x.files_path)) from (
        select j.id, j.token, j.files_path
          from jobs j where j.qc_status = 'ok' and j.qc_at < now() - make_interval(days => st.cleanup_days)
          and j.files_path is not null and j.files_purged_at is null
        union all
        select d.job_id, d.token, d.files_path
          from jobs_deleted d where d.files_path is not null and d.purged_at is null) x), '[]'::jsonb)
  );
end $$;
-- @@
grant execute on function agent_jobs(text) to anon, authenticated;
-- @@

-- Compte rendu de l'agent : inchangé pour une commande vivante ; pour une commande supprimée, seule la purge est notée dans le journal
create or replace function agent_report(p_token text, p_job uuid, p_patch jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not agent_ok(p_token) then raise exception 'bad_agent_token'; end if;
  update jobs set
    files_downloaded_at = case when p_patch ? 'files_downloaded_at' then (p_patch->>'files_downloaded_at')::timestamptz else files_downloaded_at end,
    download_started_at = case when p_patch ? 'download_started_at' then (p_patch->>'download_started_at')::timestamptz else download_started_at end,
    files_purged_at     = case when p_patch ? 'files_purged_at' then (p_patch->>'files_purged_at')::timestamptz else files_purged_at end,
    files_count         = case when p_patch ? 'files_count' then (p_patch->>'files_count')::int else files_count end,
    files_bytes         = case when p_patch ? 'files_bytes' then (p_patch->>'files_bytes')::bigint else files_bytes end,
    files_path          = case when p_patch ? 'files_path' then left(p_patch->>'files_path', 500) else files_path end,
    download_attempts   = case when p_patch ? 'download_attempts' then (p_patch->>'download_attempts')::int else download_attempts end,
    download_error      = case when p_patch ? 'download_error' then left(p_patch->>'download_error', 900) else download_error end
  where id = p_job;
  if not found and p_patch ? 'files_purged_at' then
    update jobs_deleted set purged_at = coalesce((p_patch->>'files_purged_at')::timestamptz, now()) where job_id = p_job and purged_at is null;
  end if;
end $$;
-- @@
grant execute on function agent_report(text, uuid, jsonb) to anon, authenticated;
-- @@
notify pgrst, 'reload schema';
