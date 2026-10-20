-- Version pour le SQL Editor de Supabase.

-- Ilana v1c — rattrapage après ilana_v1 : editor_kpis refusait « column reference "editor_id" is ambiguous » (jobs.editor_id vs alias). Même fonction, alias renommé.
-- ───────────── 4. Indicateurs par monteur + IA vs humains (admins connectés ; le robot passe avec la clé service)
create or replace function editor_kpis(p_from date, p_to date) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_from timestamptz; v_to timestamptz; v_out jsonb;
begin
  if coalesce(auth.role(), '') <> 'service_role' and coalesce(my_role(), '') <> 'admin' then raise exception 'ADMIN_REQUIS'; end if;
  v_from := p_from::timestamptz; v_to := (p_to + 1)::timestamptz;
  with ed as (
    select e.id, e.name, e.is_ai, e.active, e.avatar_url, e.pilot_ids from editors e
  ), jb as (
    select j.*, x.ed_id from jobs j cross join lateral unnest(j.editor_ids) as x(ed_id)   -- ed_id : jobs a déjà une colonne editor_id (ancienne attribution)
  ), per as (
    select ed.id, ed.name, ed.is_ai, ed.active, ed.avatar_url, ed.pilot_ids,
      (select count(*) from jb where jb.ed_id = ed.id and jb.created_at >= v_from and jb.created_at < v_to) as assigned,
      (select count(*) from jb where jb.ed_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to) as delivered,
      (select count(*) from jb where jb.ed_id = ed.id and jb.qc_status = 'ok' and jb.qc_at >= v_from and jb.qc_at < v_to) as approved,
      (select coalesce(sum(jb.qc_round), 0) from jb where jb.ed_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to) as revision_rounds,
      (select count(*) from jb where jb.ed_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to and jb.qc_round > 0) as with_revisions,
      (select round(avg(extract(epoch from (jb.delivered_at - jb.created_at)) / 3600)::numeric, 1) from jb where jb.ed_id = ed.id and jb.delivered_at >= v_from and jb.delivered_at < v_to) as avg_hours,
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
end $$;

revoke execute on function editor_kpis(date, date) from public;

grant execute on function editor_kpis(date, date) to authenticated, service_role;
