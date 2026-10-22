-- DS Editing — CHRONO DE MONTAGE v1 (22/10/2026) : un bouton « Mulai / Start » et un bouton « Selesai / Finish » par commande, sur la vue équipe.
-- Appliquer : coller tel quel dans le SQL Editor de Supabase et lancer (rejouable à l'identique). PRÉREQUIS : vue_equipe_v1.sql (rôle 'viewer', _team_auth).
--
-- DÉCISIONS (QCM de Cyriaque du 22/10/2026, artifact XUGzSaVkY3fA9S2h9chvGk) :
--   bouton sur la vue équipe (lien commun) ; le monteur choisit son nom dans la liste ; unité = une commande du dashboard ; un seul chrono
--   début → fin, pas de pause (plusieurs sessions s'additionnent) ; plusieurs chronos en parallèle autorisés ; Ilana comptée comme les autres ;
--   oubli = coupure automatique à 6 h, session marquée « à vérifier » ; PERSONNE ne corrige (figé) ; pas de saisie manuelle ; moins d'1 minute = ignoré ;
--   monteur voit ses temps + classement du jour ; Putu et Rania voient les temps SANS coût ; client jamais ; télé = chronos en cours ;
--   taux horaire par monteur saisi par l'admin, JAMAIS visible monteur ; chrono séparé des points /prod ; Terminer ne change rien à la commande.
--
-- MÉCANISME :
--   time_sessions : une ligne par session (commande, monteur, début, fin, coupure auto, commentaire). Écriture SEULEMENT par chrono_start / chrono_stop
--     (security definer, authentifiées par le code du lien comme team_jobs). Aucune politique d'écriture pour les comptes : figé par construction.
--   Lecture : comptes admin / dispatch / qualité (politique RLS) ; la télé et les monteurs passent par des RPC qui ne portent jamais de prix.
--   editor_rates : taux horaire par monteur, admin seul (RLS). chrono_stats() ne calcule le coût que pour un admin (ou la clé service du robot).
--   Coupure 6 h : _chrono_sweep() ferme toute session ouverte depuis plus de 6 h (ended_at = début + 6 h, auto_cut = true) ; appelé par chaque RPC
--     et par le robot (toutes les 10 min). La règle est donc tenue même si personne n'ouvre la page.
-- Règle maison : grant explicite pour toute nouvelle RPC / table (audit du 30/09).
--
-- ROLLBACK (SQL Editor) :
--   drop function if exists chrono_state(text), chrono_start(text, uuid, uuid), chrono_stop(text, uuid, text), chrono_running(), chrono_stats(date, date), chrono_sweep(), _chrono_sweep(), _chrono_minutes(timestamptz, timestamptz);
--   drop table if exists time_sessions; drop table if exists editor_rates; notify pgrst, 'reload schema';

-- ------------------------------------------------------------------ 1. tables
create table if not exists time_sessions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  editor_id uuid not null references editors(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  auto_cut boolean not null default false,          -- coupée à 6 h par le balayage : « à vérifier »
  comment text,                                      -- une ligne facultative à la fin (200 caractères max)
  link_id uuid references team_links(id) on delete set null,   -- lien qui a servi (traçabilité, jamais affiché)
  created_at timestamptz not null default now(),
  constraint time_sessions_order check (ended_at is null or ended_at >= started_at),
  constraint time_sessions_comment_len check (comment is null or char_length(comment) <= 200)
);
-- @@
comment on table time_sessions is 'Chrono de montage (22/10/2026) : une session par appui Démarrer → Terminer. Écriture par chrono_start / chrono_stop seulement. Figé : personne ne corrige.';
-- @@
create index if not exists time_sessions_job_idx on time_sessions (job_id);
-- @@
create index if not exists time_sessions_editor_started_idx on time_sessions (editor_id, started_at desc);
-- @@
create index if not exists time_sessions_open_idx on time_sessions (started_at) where ended_at is null;
-- @@
alter table time_sessions enable row level security;
-- @@
revoke all on time_sessions from public, anon, authenticated;
-- @@
grant select on time_sessions to authenticated;
-- @@
grant select, insert, update, delete on time_sessions to service_role;
-- @@
drop policy if exists time_sessions_team_read on time_sessions;
-- @@
-- lecture par les comptes nominatifs de l'équipe (dashboard) : jamais un monteur, jamais un client, jamais la télé (compte editor)
create policy time_sessions_team_read on time_sessions for select to authenticated using (my_role() in ('admin', 'dispatcher', 'qc'));
-- @@

create table if not exists editor_rates (
  editor_id uuid primary key references editors(id) on delete cascade,
  hourly_rate numeric(10,2) not null check (hourly_rate >= 0),
  currency text not null default 'EUR' check (currency in ('EUR', 'USD', 'IDR')),
  updated_at timestamptz not null default now()
);
-- @@
comment on table editor_rates is 'Taux horaire par monteur, saisi par l''admin (prod-admin → Temps). Jamais lu par un monteur, un dispatch, la qualité ni la télé.';
-- @@
alter table editor_rates enable row level security;
-- @@
revoke all on editor_rates from public, anon, authenticated;
-- @@
grant select, insert, update, delete on editor_rates to authenticated;
-- @@
grant select, insert, update, delete on editor_rates to service_role;
-- @@
drop policy if exists editor_rates_admin on editor_rates;
-- @@
create policy editor_rates_admin on editor_rates for all to authenticated using (my_role() = 'admin') with check (my_role() = 'admin');
-- @@

-- ------------------------------------------------------------------ 2. aides : minutes d'une session, balayage 6 h
create or replace function _chrono_minutes(p_start timestamptz, p_end timestamptz) returns int language sql immutable as $$
  select greatest(0, floor(extract(epoch from (coalesce(p_end, now()) - p_start)) / 60))::int
$$;
-- @@
revoke all on function _chrono_minutes(timestamptz, timestamptz) from public, anon, authenticated;
-- @@
-- ferme les sessions ouvertes depuis plus de 6 h : fin = début + 6 h, marquée « à vérifier ». Renvoie le nombre de sessions coupées.
create or replace function _chrono_sweep() returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update time_sessions set ended_at = started_at + interval '6 hours', auto_cut = true
    where ended_at is null and started_at < now() - interval '6 hours';
  get diagnostics n = row_count;
  return n;
end $$;
-- @@
revoke all on function _chrono_sweep() from public, anon, authenticated;
-- @@
-- version appelable par le robot (clé service) : même chose, exposée
create or replace function chrono_sweep() returns int language sql security definer set search_path = public as $$ select _chrono_sweep() $$;
-- @@
revoke all on function chrono_sweep() from public, anon, authenticated;
-- @@
grant execute on function chrono_sweep() to service_role;
-- @@

-- ------------------------------------------------------------------ 3. état du chrono pour la vue équipe (lien commun) : en cours, totaux du jour, totaux par commande
-- Jour = jour de Bali (Asia/Makassar). Jamais de prix, jamais de taux. Classement du jour visible par tous les monteurs (décision q17).
create or replace function chrono_state(p_key text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a record; v_running jsonb; v_today jsonb; v_jobs jsonb; v_day date := (now() at time zone 'Asia/Makassar')::date;
begin
  select * into a from _team_auth(p_key);
  if a.o_err is not null then return jsonb_build_object('error', a.o_err); end if;
  perform _chrono_sweep();
  -- sessions en cours (toutes, pour les pastilles sur les lignes des autres monteurs)
  select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'job_id', s.job_id, 'editor_id', s.editor_id, 'started_at', s.started_at) order by s.started_at), '[]'::jsonb)
    into v_running from time_sessions s where s.ended_at is null;
  -- totaux du jour par monteur (sessions commencées aujourd'hui à Bali, en cours comprises)
  select coalesce(jsonb_agg(jsonb_build_object('editor_id', x.editor_id, 'minutes', x.minutes, 'sessions', x.n, 'jobs', x.jobs, 'flagged', x.flagged) order by x.minutes desc), '[]'::jsonb)
    into v_today
    from (select s.editor_id, sum(_chrono_minutes(s.started_at, s.ended_at)) as minutes, count(*) as n, count(distinct s.job_id) as jobs, count(*) filter (where s.auto_cut) as flagged
          from time_sessions s where (s.started_at at time zone 'Asia/Makassar')::date = v_day group by s.editor_id) x;
  -- totaux par commande et par monteur (toutes dates), limités aux commandes encore visibles sur la vue (non terminées ou terminées depuis < 7 jours)
  select coalesce(jsonb_agg(jsonb_build_object('job_id', x.job_id, 'editor_id', x.editor_id, 'minutes', x.minutes, 'sessions', x.n, 'flagged', x.flagged)), '[]'::jsonb)
    into v_jobs
    from (select s.job_id, s.editor_id, sum(_chrono_minutes(s.started_at, s.ended_at)) as minutes, count(*) as n, count(*) filter (where s.auto_cut) as flagged
          from time_sessions s join jobs j on j.id = s.job_id
          where j.qc_status is distinct from 'ok' or coalesce(j.qc_at, j.delivered_at, j.updated_at) > now() - interval '7 days'
          group by s.job_id, s.editor_id) x;
  return jsonb_build_object('running', v_running, 'today', v_today, 'jobs', v_jobs, 'day', v_day, 'server_time', now());
end $$;
-- @@
revoke all on function chrono_state(text) from public;
-- @@
grant execute on function chrono_state(text) to anon, authenticated, service_role;
-- @@

-- ------------------------------------------------------------------ 4. démarrer : une session par (monteur, commande) en cours ; parallèle autorisé (q9)
create or replace function chrono_start(p_key text, p_job uuid, p_editor uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a record; s time_sessions; v_active boolean;
begin
  select * into a from _team_auth(p_key);
  if a.o_err is not null then return jsonb_build_object('error', a.o_err); end if;
  if a.o_role = 'editor' and a.o_editor is distinct from p_editor then return jsonb_build_object('error', 'MONTEUR_INTERDIT'); end if;   -- lien personnel : son nom seulement
  select active into v_active from editors where id = p_editor;
  if v_active is distinct from true then return jsonb_build_object('error', 'MONTEUR_INCONNU'); end if;
  if not exists (select 1 from jobs where id = p_job) then return jsonb_build_object('error', 'COMMANDE_INCONNUE'); end if;
  perform _chrono_sweep();
  select * into s from time_sessions where job_id = p_job and editor_id = p_editor and ended_at is null limit 1;
  if s.id is not null then return jsonb_build_object('id', s.id, 'started_at', s.started_at, 'already', true); end if;   -- double clic : même session
  insert into time_sessions (job_id, editor_id, link_id) values (p_job, p_editor, a.o_id) returning * into s;
  return jsonb_build_object('id', s.id, 'started_at', s.started_at, 'already', false);
end $$;
-- @@
revoke all on function chrono_start(text, uuid, uuid) from public;
-- @@
grant execute on function chrono_start(text, uuid, uuid) to anon, authenticated, service_role;
-- @@

-- ------------------------------------------------------------------ 5. terminer : fin = maintenant ; moins d'une minute = session effacée (q14) ; commentaire facultatif (q33)
create or replace function chrono_stop(p_key text, p_session uuid, p_comment text default null) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a record; s time_sessions; v_min int;
begin
  select * into a from _team_auth(p_key);
  if a.o_err is not null then return jsonb_build_object('error', a.o_err); end if;
  select * into s from time_sessions where id = p_session;
  if s.id is null then return jsonb_build_object('error', 'SESSION_INCONNUE'); end if;
  if a.o_role = 'editor' and a.o_editor is distinct from s.editor_id then return jsonb_build_object('error', 'MONTEUR_INTERDIT'); end if;
  if s.ended_at is not null then return jsonb_build_object('id', s.id, 'minutes', _chrono_minutes(s.started_at, s.ended_at), 'already', true, 'auto_cut', s.auto_cut); end if;
  v_min := _chrono_minutes(s.started_at, now());
  if v_min < 1 then delete from time_sessions where id = s.id; return jsonb_build_object('id', s.id, 'minutes', 0, 'ignored', true); end if;
  update time_sessions set ended_at = now(), comment = nullif(left(btrim(coalesce(p_comment, '')), 200), '') where id = s.id returning * into s;
  return jsonb_build_object('id', s.id, 'minutes', _chrono_minutes(s.started_at, s.ended_at), 'already', false);
end $$;
-- @@
revoke all on function chrono_stop(text, uuid, text) from public;
-- @@
grant execute on function chrono_stop(text, uuid, text) to anon, authenticated, service_role;
-- @@

-- ------------------------------------------------------------------ 6. chronos en cours pour la télé et le dashboard (comptes connectés, tous rôles) : jamais de prix
create or replace function chrono_running() returns jsonb
language plpgsql security definer set search_path = public as $$
declare v jsonb;
begin
  if auth.uid() is null and coalesce(auth.role(), '') <> 'service_role' then raise exception 'REFUSE'; end if;
  if (select role from profiles where id = auth.uid()) = 'client' then raise exception 'REFUSE'; end if;
  perform _chrono_sweep();
  select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'job_id', s.job_id, 'editor_id', s.editor_id, 'editor', e.name, 'is_ai', e.is_ai, 'avatar_url', e.avatar_url,
      'client', j.client_name, 'project', j.project, 'token', j.token, 'started_at', s.started_at) order by s.started_at), '[]'::jsonb)
    into v from time_sessions s join editors e on e.id = s.editor_id join jobs j on j.id = s.job_id where s.ended_at is null;
  return jsonb_build_object('running', v, 'server_time', now());
end $$;
-- @@
revoke all on function chrono_running() from public, anon;
-- @@
grant execute on function chrono_running() to authenticated, service_role;
-- @@

-- ------------------------------------------------------------------ 7. statistiques (prod-admin → Temps, récap Telegram du robot) : admin / dispatch / qualité ; coût pour l'admin et la clé service seulement
create or replace function chrono_stats(p_from date, p_to date) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_role text; v_money boolean; v_eds jsonb; v_jobs jsonb; v_days jsonb; v_sessions jsonb; v_tot jsonb;
begin
  v_role := case when coalesce(auth.role(), '') = 'service_role' then 'service' else my_role() end;
  if v_role is null or v_role not in ('service', 'admin', 'dispatcher', 'qc') then raise exception 'REFUSE'; end if;
  v_money := v_role in ('service', 'admin');
  perform _chrono_sweep();
  drop table if exists _cs;
  create temp table _cs on commit drop as
    select s.id, s.job_id, s.editor_id, s.started_at, s.ended_at, s.auto_cut, s.comment,
           (s.started_at at time zone 'Asia/Makassar')::date as day, _chrono_minutes(s.started_at, s.ended_at) as minutes
    from time_sessions s
    where (s.started_at at time zone 'Asia/Makassar')::date between p_from and p_to;
  select coalesce(jsonb_agg(jsonb_build_object('editor_id', e.id, 'name', e.name, 'is_ai', e.is_ai, 'active', e.active, 'minutes', x.minutes, 'sessions', x.n, 'jobs', x.jobs, 'flagged', x.flagged, 'days', x.days,
      'hourly_rate', case when v_money then r.hourly_rate end, 'currency', case when v_money then r.currency end,
      'cost', case when v_money and r.hourly_rate is not null then round(x.minutes / 60.0 * r.hourly_rate, 2) end) order by x.minutes desc, e.name), '[]'::jsonb)
    into v_eds
    from (select editor_id, sum(minutes) as minutes, count(*) as n, count(distinct job_id) as jobs, count(*) filter (where auto_cut) as flagged, count(distinct day) as days from _cs group by editor_id) x
    join editors e on e.id = x.editor_id left join editor_rates r on r.editor_id = e.id;
  select coalesce(jsonb_agg(jsonb_build_object('job_id', j.id, 'token', j.token, 'client', j.client_name, 'project', j.project, 'qc_status', j.qc_status, 'delivered_at', j.delivered_at,
      'minutes', x.minutes, 'sessions', x.n, 'flagged', x.flagged, 'editors', x.eds, 'cost', case when v_money then x.cost end) order by x.minutes desc), '[]'::jsonb)
    into v_jobs
    from (select c.job_id, sum(c.minutes) as minutes, count(*) as n, count(*) filter (where c.auto_cut) as flagged,
                 (select jsonb_agg(jsonb_build_object('editor_id', y.editor_id, 'name', e2.name, 'minutes', y.m) order by y.m desc)
                    from (select editor_id, sum(minutes) as m from _cs c2 where c2.job_id = c.job_id group by editor_id) y join editors e2 on e2.id = y.editor_id) as eds,
                 sum(case when r.hourly_rate is not null then round(c.minutes / 60.0 * r.hourly_rate, 2) end) as cost
          from _cs c left join editor_rates r on r.editor_id = c.editor_id group by c.job_id) x
    join jobs j on j.id = x.job_id;
  select coalesce(jsonb_agg(jsonb_build_object('day', x.day, 'minutes', x.minutes, 'sessions', x.n, 'editors', x.eds) order by x.day), '[]'::jsonb)
    into v_days from (select day, sum(minutes) as minutes, count(*) as n, count(distinct editor_id) as eds from _cs group by day) x;
  select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'day', c.day, 'job_id', c.job_id, 'token', j.token, 'client', j.client_name, 'project', j.project, 'editor_id', c.editor_id, 'editor', e.name,
      'started_at', c.started_at, 'ended_at', c.ended_at, 'minutes', c.minutes, 'auto_cut', c.auto_cut, 'comment', c.comment) order by c.started_at desc), '[]'::jsonb)
    into v_sessions from _cs c join jobs j on j.id = c.job_id join editors e on e.id = c.editor_id;
  select jsonb_build_object('minutes', coalesce(sum(minutes), 0), 'sessions', count(*), 'jobs', count(distinct job_id), 'editors', count(distinct editor_id), 'flagged', count(*) filter (where auto_cut), 'running', count(*) filter (where ended_at is null))
    into v_tot from _cs;
  return jsonb_build_object('from', p_from, 'to', p_to, 'money', v_money, 'total', v_tot, 'editors', v_eds, 'jobs', v_jobs, 'days', v_days, 'sessions', v_sessions,
    'rates', case when v_money then (select coalesce(jsonb_agg(jsonb_build_object('editor_id', r.editor_id, 'hourly_rate', r.hourly_rate, 'currency', r.currency)), '[]'::jsonb) from editor_rates r) else '[]'::jsonb end);
end $$;
-- @@
revoke all on function chrono_stats(date, date) from public, anon;
-- @@
grant execute on function chrono_stats(date, date) to authenticated, service_role;
-- @@

notify pgrst, 'reload schema';
-- @@

-- ------------------------------------------------------------------ 8. preuve d'application : cette requête DOIT renvoyer 1 ligne
select 'chrono_v1 appliqué' as resultat,
       (select count(*) from information_schema.tables where table_name in ('time_sessions', 'editor_rates')) as tables_attendues_2,
       (select count(*) from pg_proc where proname in ('chrono_state', 'chrono_start', 'chrono_stop', 'chrono_running', 'chrono_stats', 'chrono_sweep', '_chrono_sweep', '_chrono_minutes')) as fonctions_attendues_8,
       (select count(*) from pg_policies where tablename in ('time_sessions', 'editor_rates')) as politiques_attendues_2;
