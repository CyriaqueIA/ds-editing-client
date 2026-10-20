-- Ilana, monteuse IA (décisions QCM de Cyriaque du 20/10/2026, artifact S2paovvTtPSrAKG2Gr9DU5).
-- À coller dans le SQL Editor de Supabase (le mot de passe SQL du Mac est périmé). Blocs séparés par « -- @@ ».
--
-- 1. editors : drapeau IA + pilotes (Rafi, Ferdi ; d'autres plus tard, par le dashboard /prod-admin → Équipe ou en base).
-- 2. /prod : quand le monteur déclaré est une IA, le pilote choisit son nom et note les minutes de pilotage PAR vidéo terminée
--    (q17-q19) ; les points vont à Ilana pour la statistique, le pilote est identifié pour la paie (q18).
-- 3. Espace client : question « Souhaitez-vous retravailler avec <prénom> ? » (oui / non + commentaire facultatif) sur chaque
--    commande livrée, pour TOUS les monteurs (q29-q38). Un « oui » à une IA marque le studio « IA OK » (q37), l'attribution
--    reste manuelle. Historique conservé : une ligne par réponse, la dernière compte.
-- 4. editor_kpis(from, to) : indicateurs par monteur + agrégats IA vs humains, pour l'onglet « IA vs humains » de /prod-admin
--    (admins) et le récap Telegram du vendredi (robot ds-editing-ops, clé service).
-- Règle maison : grant explicite pour toute nouvelle RPC / table (audit du 30/09).

alter table editors add column if not exists is_ai boolean not null default false
-- @@
alter table editors add column if not exists pilot_ids uuid[] not null default '{}'   -- monteurs humains qui pilotent cette IA
-- @@
insert into editors (name, sort, active, is_ai, pilot_ids)
  values ('Ilana', 14, true, true, (select coalesce(array_agg(id order by sort), '{}') from editors where name in ('Rafi', 'Ferdi')))
  on conflict (name) do update set is_ai = true, active = true,
    pilot_ids = case when cardinality(editors.pilot_ids) = 0 then excluded.pilot_ids else editors.pilot_ids end
-- @@
insert into editor_keys (editor_id) select id from editors where name = 'Ilana' on conflict do nothing
-- @@
alter table studios add column if not exists ai_ok boolean            -- dernier avis du client sur une monteuse IA (null = jamais répondu)
-- @@
alter table studios add column if not exists ai_ok_at timestamptz
-- @@

-- ───────────── 2. /prod : pilote + minutes de pilotage par vidéo terminée (IA seulement)
alter table prod_reports add column if not exists pilot_id uuid references editors(id)
-- @@
alter table prod_reports add column if not exists pilot_minutes jsonb not null default '{}'::jsonb   -- { "reel_fr": [25, 40], … } une valeur par terminé
-- @@
alter table prod_reports add column if not exists pilot_total int not null default 0
-- @@
create or replace function prod_editors() returns jsonb language sql stable security definer set search_path = public as $$
  select case when now() < prod_enroll_until()
    then (select coalesce(jsonb_agg(jsonb_build_object('id', e.id, 'name', e.name, 'avatar_url', e.avatar_url, 'is_ai', e.is_ai, 'pilot_ids', e.pilot_ids) order by e.sort, e.name), '[]'::jsonb) from editors e where e.active)
    else '[]'::jsonb end
$$
-- @@
create or replace function prod_me(p_key text) returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('id', e.id, 'name', e.name, 'avatar_url', e.avatar_url, 'is_ai', e.is_ai, 'pilot_ids', e.pilot_ids)
  from editor_keys k join editors e on e.id = k.editor_id where k.report_key = p_key and length(coalesce(p_key, '')) >= 16 and e.active
$$
-- @@
create or replace function prod_get_report(p_key text, p_date date) returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('counts', r.counts, 'links', r.links, 'revisions', r.revisions, 'details', r.details, 'comment', r.comment, 'points', r.points, 'updated_at', r.updated_at,
    'pilot_id', r.pilot_id, 'pilot_minutes', r.pilot_minutes)
  from editor_keys k join prod_reports r on r.editor_id = k.editor_id
  where k.report_key = p_key and length(coalesce(p_key, '')) >= 16 and r.report_date = p_date
$$
-- @@
-- Nouvelle signature (9 arguments, p_pilot) : l'ancienne à 8 arguments reste en place jusqu'à la mise en ligne de /prod, puis ilana_v1b.sql la supprime.
create or replace function prod_submit(p_key text, p_date date, p_counts jsonb, p_details text, p_comment text, p_lang text, p_links jsonb, p_revisions jsonb, p_pilot jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_editor uuid; v_name text; v_ai boolean; v_pilots uuid[]; v_points numeric := 0; v_elems int := 0; v_prog int := 0; v_rates jsonb := '{}'::jsonb; c record; v_done int; v_pct int; v_counts jsonb := '{}'::jsonb; v_id uuid;
  v_links jsonb := '{}'::jsonb; v_arr jsonb; v_urls text[] := '{}'; u text; x jsonb; i int;
  v_revs jsonb := '[]'::jsonb; v_rcount int := 0; v_rmin int := 0; v_rpts numeric := 0; v_cat record; v_min int; v_sid uuid; v_client text;
  v_pilot uuid := null; v_pmin jsonb := '{}'::jsonb; v_parr jsonb; v_ptot int := 0; v_m int;
begin
  select e.id, e.name, e.is_ai, e.pilot_ids into v_editor, v_name, v_ai, v_pilots from editor_keys k join editors e on e.id = k.editor_id
    where k.report_key = p_key and length(coalesce(p_key, '')) >= 16 and e.active;
  if v_editor is null then raise exception 'bad_key'; end if;
  if p_date is null or p_date > current_date + 1 or p_date < current_date - 14 then raise exception 'bad_date'; end if;
  -- IA : un pilote (parmi les pilotes déclarés, sinon n'importe quel monteur humain actif) et des minutes par vidéo terminée
  if v_ai then
    if (p_pilot->>'pilot_id') ~* '^[0-9a-f-]{36}$' then
      select e.id into v_pilot from editors e where e.id = (p_pilot->>'pilot_id')::uuid and e.active and not e.is_ai
        and (cardinality(v_pilots) = 0 or e.id = any(v_pilots));
    end if;
  end if;
  -- production : terminés × barème, un lien Frame.io par terminé
  for c in select key, points from prod_categories where active loop
    v_done := greatest(0, least(500, coalesce((p_counts->c.key->>'done')::int, 0)));
    v_pct  := greatest(0, least(100, coalesce((p_counts->c.key->>'progress')::int, 0)));
    v_points := v_points + v_done * c.points; v_elems := v_elems + v_done; if v_pct > 0 then v_prog := v_prog + 1; end if;
    v_rates := v_rates || jsonb_build_object(c.key, c.points);
    v_counts := v_counts || jsonb_build_object(c.key, jsonb_build_object('done', v_done, 'progress', v_pct));
    v_arr := '[]'::jsonb; v_parr := '[]'::jsonb;
    if v_done > 0 then
      if jsonb_typeof(p_links->c.key) is distinct from 'array' or jsonb_array_length(p_links->c.key) <> v_done then raise exception 'need_links'; end if;
      for i in 0 .. v_done - 1 loop
        u := trim(coalesce(p_links->c.key->>i, ''));
        if not prod_link_ok(u) then raise exception 'bad_link'; end if;
        v_arr := v_arr || to_jsonb(u); v_urls := v_urls || lower(u);
        if v_ai then
          v_m := case when (p_pilot->'minutes'->c.key->>i) ~ '^\d{1,4}$' then (p_pilot->'minutes'->c.key->>i)::int else -1 end;
          if v_m < 0 or v_m > 600 then raise exception 'need_pilot'; end if;
          v_parr := v_parr || to_jsonb(v_m); v_ptot := v_ptot + v_m;
        end if;
      end loop;
      v_links := v_links || jsonb_build_object(c.key, v_arr);
      if v_ai then v_pmin := v_pmin || jsonb_build_object(c.key, v_parr); end if;
    end if;
  end loop;
  if v_ai and v_elems > 0 and v_pilot is null then raise exception 'need_pilot'; end if;
  -- révisions : une ligne par révision, points de la catégorie, temps informatif
  if p_revisions is not null and jsonb_typeof(p_revisions) = 'array' then
    if jsonb_array_length(p_revisions) > 50 then raise exception 'bad_revision'; end if;
    for x in select value from jsonb_array_elements(p_revisions) loop
      select key, rev_points into v_cat from prod_categories where active and key = x->>'cat';
      if v_cat.key is null then raise exception 'bad_revision'; end if;
      v_min := case when (x->>'minutes') ~ '^\d{1,4}$' then (x->>'minutes')::int else 0 end;
      if v_min < 1 or v_min > 240 then raise exception 'bad_revision'; end if;
      u := trim(coalesce(x->>'url', ''));
      if not prod_link_ok(u) then raise exception 'bad_link'; end if;
      v_sid := null; v_client := null;
      if (x->>'studio_id') ~* '^[0-9a-f-]{36}$' then select id, name into v_sid, v_client from studios where id = (x->>'studio_id')::uuid; end if;
      if v_sid is null then v_client := left(trim(coalesce(x->>'client', '')), 80); end if;
      if coalesce(v_client, '') = '' then raise exception 'bad_revision'; end if;
      v_revs := v_revs || jsonb_build_array(jsonb_build_object('cat', v_cat.key, 'studio_id', v_sid, 'client', v_client, 'minutes', v_min, 'url', u, 'pts', v_cat.rev_points));
      v_rcount := v_rcount + 1; v_rmin := v_rmin + v_min; v_rpts := v_rpts + v_cat.rev_points; v_urls := v_urls || lower(u);
    end loop;
  end if;
  if (select count(distinct v) from unnest(v_urls) v) <> coalesce(array_length(v_urls, 1), 0) then raise exception 'dup_link'; end if;
  if v_elems = 0 and v_prog = 0 and v_rcount = 0 and length(trim(coalesce(p_details, ''))) = 0 then raise exception 'empty'; end if;
  insert into prod_reports (editor_id, editor_name, report_date, lang, counts, points, elements, in_progress, rates, details, comment, links, revisions, rev_count, rev_minutes, rev_points, pilot_id, pilot_minutes, pilot_total)
  values (v_editor, v_name, p_date, case when p_lang in ('fr','en','id') then p_lang else 'fr' end, v_counts, v_points + v_rpts, v_elems, v_prog, v_rates, left(p_details, 4000), left(p_comment, 2000),
    v_links, v_revs, v_rcount, v_rmin, v_rpts, v_pilot, v_pmin, v_ptot)
  on conflict (editor_id, report_date) do update set counts = excluded.counts, points = excluded.points, elements = excluded.elements,
    in_progress = excluded.in_progress, rates = excluded.rates, details = excluded.details, comment = excluded.comment, lang = excluded.lang,
    links = excluded.links, revisions = excluded.revisions, rev_count = excluded.rev_count, rev_minutes = excluded.rev_minutes, rev_points = excluded.rev_points,
    pilot_id = excluded.pilot_id, pilot_minutes = excluded.pilot_minutes, pilot_total = excluded.pilot_total
  returning id into v_id;
  return jsonb_build_object('id', v_id, 'points', v_points + v_rpts, 'elements', v_elems, 'in_progress', v_prog, 'rev_count', v_rcount, 'rev_minutes', v_rmin, 'pilot_total', v_ptot);
end $$
-- @@
revoke execute on function prod_submit(text, date, jsonb, text, text, text, jsonb, jsonb, jsonb) from public
-- @@
grant execute on function prod_submit(text, date, jsonb, text, text, text, jsonb, jsonb, jsonb) to anon, authenticated
-- @@
create or replace function prod_stats_public() returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'cats', (select coalesce(jsonb_agg(to_jsonb(c) order by c.sort), '[]'::jsonb) from prod_categories c),
    'editors', (select coalesce(jsonb_agg(jsonb_build_object('id', e.id, 'name', e.name, 'avatar_url', e.avatar_url, 'active', e.active, 'sort', e.sort, 'is_ai', e.is_ai, 'pilot_ids', e.pilot_ids) order by e.sort, e.name), '[]'::jsonb) from editors e),
    'reports', (select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'editor_id', r.editor_id, 'editor_name', r.editor_name, 'report_date', r.report_date,
        'lang', r.lang, 'counts', r.counts, 'points', r.points, 'elements', r.elements, 'in_progress', r.in_progress, 'rates', r.rates,
        'details', r.details, 'comment', r.comment, 'updated_at', r.updated_at,
        'links', r.links, 'revisions', r.revisions, 'rev_count', r.rev_count, 'rev_minutes', r.rev_minutes, 'rev_points', r.rev_points,
        'pilot_id', r.pilot_id, 'pilot_minutes', r.pilot_minutes, 'pilot_total', r.pilot_total) order by r.report_date desc), '[]'::jsonb)
      from prod_reports r where r.report_date >= current_date - 400))
$$
-- @@

-- ───────────── 3. Espace client : « Souhaitez-vous retravailler avec <prénom> ? »
create table if not exists editor_feedback (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  studio_id uuid references studios(id) on delete set null,
  editor_id uuid references editors(id) on delete set null,
  editor_name text not null,
  answer boolean not null,                        -- true = oui, je veux retravailler avec ce monteur
  comment text,
  lang text,
  created_at timestamptz not null default now(),
  notified_at timestamptz                         -- ligne Telegram envoyée par le robot (poll.mjs)
)
-- @@
create index if not exists editor_feedback_job_idx on editor_feedback(job_id, editor_name, created_at desc)
-- @@
create index if not exists editor_feedback_editor_idx on editor_feedback(editor_id, created_at desc)
-- @@
alter table editor_feedback enable row level security
-- @@
revoke all on editor_feedback from anon, authenticated
-- @@
grant select on editor_feedback to authenticated
-- @@
grant update, delete on editor_feedback to authenticated
-- @@
drop policy if exists editor_feedback_read_team on editor_feedback
-- @@
create policy editor_feedback_read_team on editor_feedback for select to authenticated using (my_role() in ('admin', 'dispatcher', 'qc'))
-- @@
drop policy if exists editor_feedback_admin on editor_feedback
-- @@
create policy editor_feedback_admin on editor_feedback for all to authenticated using (my_role() = 'admin') with check (my_role() = 'admin')
-- @@
-- Le client répond depuis son espace (lien slug + clé), sur une commande livrée, pour un monteur de la commande. Pas de compte, pas de mot de passe.
create or replace function space_feedback(p_slug text, p_key text, p_token text, p_editor_name text, p_answer boolean, p_comment text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare s studios; j jobs; e editors; v_id uuid;
begin
  if not rate_hit('space_feedback', 60, 60) then raise exception 'too_many'; end if;
  select * into s from studios where slug = p_slug and access_token = p_key;
  if s.id is null then raise exception 'LIEN_INVALIDE'; end if;
  select * into j from jobs where token = p_token and (studio_id = s.id or (studio_id is null and client_name = s.form_client));
  if j.id is null then raise exception 'COMMANDE_INCONNUE'; end if;
  if j.qc_status <> 'ok' then raise exception 'PAS_LIVREE'; end if;
  if p_editor_name is null or not (p_editor_name = any(j.editor_names)) then raise exception 'MONTEUR_INCONNU'; end if;
  if p_answer is null then raise exception 'REPONSE_REQUISE'; end if;
  select * into e from editors where name = p_editor_name;
  insert into editor_feedback (job_id, studio_id, editor_id, editor_name, answer, comment, lang)
    values (j.id, s.id, e.id, p_editor_name, p_answer, nullif(left(trim(coalesce(p_comment, '')), 1000), ''), s.lang) returning id into v_id;
  if e.id is not null and e.is_ai then update studios set ai_ok = p_answer, ai_ok_at = now() where id = s.id; end if;
  return jsonb_build_object('ok', true, 'id', v_id, 'answer', p_answer, 'at', now());
end $$
-- @@
revoke execute on function space_feedback(text, text, text, text, boolean, text) from public
-- @@
grant execute on function space_feedback(text, text, text, text, boolean, text) to anon, authenticated
-- @@
-- client_space : même corps qu'estimation_v1.sql + 'editors' (prénoms des monteurs de la commande) + 'feedback' (dernière réponse par monteur)
create or replace function client_space(p_slug text, p_key text) returns jsonb language sql stable security definer as $$
  select jsonb_build_object(
    'studio', jsonb_build_object('slug', s.slug, 'name', s.name, 'lang', s.lang, 'currency', s.currency, 'billing_name', s.billing_name),
    'jobs', coalesce((select jsonb_agg(jsonb_build_object(
        'token', j.token, 'project', j.project, 'work_to_do', j.work_to_do, 'created_at', j.created_at,
        'requested_deadline', j.requested_deadline, 'delivery_date', j.delivery_date,
        'started', j.started_at is not null, 'delivered', j.delivered_at, 'qc_ok', case when j.qc_status = 'ok' then j.qc_at else null end,
        'frameio_url', case when j.qc_status = 'ok' then j.frameio_url else null end,
        'amount', case when j.qc_status = 'ok' then j.amount else null end,
        'estimate', case when j.qc_status is distinct from 'ok' and j.invoice_id is null
                          and coalesce(cardinality(j.pricing_missing), 0) = 0 then j.amount else null end,
        'lines', case when j.qc_status = 'ok' then j.lines else '[]'::jsonb end,
        'invoice_id', j.invoice_id, 'brief_url', j.brief_url,
        'editors', case when j.qc_status = 'ok' then to_jsonb(j.editor_names) else '[]'::jsonb end,
        'feedback', coalesce((select jsonb_agg(jsonb_build_object('editor', f.editor_name, 'answer', f.answer, 'comment', f.comment, 'at', f.created_at))
                      from (select distinct on (editor_name) * from editor_feedback where job_id = j.id order by editor_name, created_at desc) f), '[]'::jsonb)
      ) order by j.created_at desc) from jobs j where j.studio_id = s.id or (j.studio_id is null and j.client_name = s.form_client)), '[]'::jsonb),
    'invoices', coalesce((select jsonb_agg(jsonb_build_object(
        'id', i.id, 'number', i.number, 'period_start', i.period_start, 'period_end', i.period_end, 'currency', i.currency,
        'status', i.status::text, 'subtotal', i.subtotal, 'total', i.total, 'issued_at', i.issued_at, 'due_at', i.due_at, 'paid_at', i.paid_at,
        'pdf_url', i.pdf_url, 'pay_url', i.pay_url, 'lines', i.lines, 'note', i.note
      ) order by i.period_start desc) from invoices i where i.studio_id = s.id and i.status <> 'annulee'), '[]'::jsonb),
    'extra_lines', coalesce((select jsonb_agg(jsonb_build_object('label', e.label, 'qty', e.qty, 'unit_price', e.unit_price, 'offered', e.offered, 'created_at', e.created_at)) from extra_lines e where e.studio_id = s.id and e.invoice_id is null), '[]'::jsonb)
  )
  from studios s where s.slug = p_slug and s.access_token = p_key
$$
-- @@
grant execute on function client_space(text, text) to anon, authenticated
-- @@

-- ───────────── 4. Indicateurs par monteur + IA vs humains (admins connectés ; le robot passe avec la clé service)
create or replace function editor_kpis(p_from date, p_to date) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_from timestamptz; v_to timestamptz; v_out jsonb;
begin
  if coalesce(auth.role(), '') <> 'service_role' and coalesce(my_role(), '') <> 'admin' then raise exception 'ADMIN_REQUIS'; end if;
  v_from := p_from::timestamptz; v_to := (p_to + 1)::timestamptz;
  with ed as (
    select e.id, e.name, e.is_ai, e.active, e.avatar_url, e.pilot_ids from editors e
  ), jb as (
    select j.*, x.editor_id from jobs j cross join lateral unnest(j.editor_ids) as x(editor_id)
  ), per as (
    select ed.id, ed.name, ed.is_ai, ed.active, ed.avatar_url, ed.pilot_ids,
      (select count(*) from jb where jb.editor_id = ed.id and jb.created_at >= v_from and jb.created_at < v_to) as assigned,
      (select count(*) from jb where jb.editor_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to) as delivered,
      (select count(*) from jb where jb.editor_id = ed.id and jb.qc_status = 'ok' and jb.qc_at >= v_from and jb.qc_at < v_to) as approved,
      (select coalesce(sum(jb.qc_round), 0) from jb where jb.editor_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to) as revision_rounds,
      (select count(*) from jb where jb.editor_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to and jb.qc_round > 0) as with_revisions,
      (select round(avg(extract(epoch from (jb.delivered_at - jb.created_at)) / 3600)::numeric, 1) from jb where jb.editor_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to) as avg_hours,
      (select count(*) from (select distinct on (job_id) answer from editor_feedback f where f.editor_id = ed.id and f.created_at >= v_from and f.created_at < v_to order by job_id, created_at desc) z where z.answer) as yes,
      (select count(*) from (select distinct on (job_id) answer from editor_feedback f where f.editor_id = ed.id and f.created_at >= v_from and f.created_at < v_to order by job_id, created_at desc) z where not z.answer) as no,
      (select coalesce(sum(r.points), 0) from prod_reports r where r.editor_id = ed.id and r.report_date >= p_from and r.report_date <= p_to) as points,
      (select coalesce(sum(r.elements), 0) from prod_reports r where r.editor_id = ed.id and r.report_date >= p_from and r.report_date <= p_to) as elements,
      (select coalesce(sum(r.pilot_total), 0) from prod_reports r where r.editor_id = ed.id and r.report_date >= p_from and r.report_date <= p_to) as pilot_minutes,
      (select coalesce(jsonb_object_agg(p.name, p.minutes), '{}'::jsonb) from (select e2.name, sum(r.pilot_total) as minutes from prod_reports r join editors e2 on e2.id = r.pilot_id
          where r.editor_id = ed.id and r.report_date >= p_from and r.report_date <= p_to group by e2.name) p) as by_pilot
    from ed
  ), grp as (
    select is_ai, sum(assigned) assigned, sum(delivered) delivered, sum(approved) approved, sum(revision_rounds) revision_rounds, sum(with_revisions) with_revisions,
      round(avg(avg_hours)::numeric, 1) avg_hours, sum(yes) yes, sum(no) no, sum(points) points, sum(elements) elements, sum(pilot_minutes) pilot_minutes, count(*) filter (where active) n
    from per group by is_ai
  )
  select jsonb_build_object(
    'from', p_from, 'to', p_to,
    'editors', coalesce((select jsonb_agg(to_jsonb(per) order by per.is_ai desc, per.name) from per where per.active or per.assigned > 0 or per.delivered > 0 or per.yes + per.no > 0), '[]'::jsonb),
    'ai', (select to_jsonb(g) from grp g where g.is_ai),
    'human', (select to_jsonb(g) from grp g where not g.is_ai),
    'feedback', coalesce((select jsonb_agg(jsonb_build_object('at', f.created_at, 'studio', s.name, 'token', j.token, 'project', j.project, 'editor', f.editor_name, 'answer', f.answer, 'comment', f.comment) order by f.created_at desc)
        from editor_feedback f join jobs j on j.id = f.job_id left join studios s on s.id = f.studio_id where f.created_at >= v_from and f.created_at < v_to), '[]'::jsonb)
  ) into v_out;
  return v_out;
end $$
-- @@
revoke execute on function editor_kpis(date, date) from public
-- @@
grant execute on function editor_kpis(date, date) to authenticated, service_role
-- @@
