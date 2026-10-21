-- DS Editing — TEST de suppression_commande_v1.sql (21/10/2026). Ne laisse AUCUNE trace : le bloc se termine par une exception, tout est annulé.
-- Lancer : coller tel quel dans le SQL Editor de Supabase, APRÈS suppression_commande_v1.sql.
--   -> message « TESTS OK … (tout annulé) » = tous les tests passent ; tout autre message = le test nommé a échoué.
--
-- CE QUE LE TEST PROUVE
--   0 structure : jobs_deleted, _job_delete_apply, job_delete, team_job_delete, agent_jobs, agent_report existent ; _job_delete_apply est fermée
--     à authenticated et anon ; job_delete est fermée à anon.
--   1 une commande pas commencée se supprime : la ligne jobs disparaît, sa partie job_parts aussi (cascade), le journal garde qui / quand /
--     par quel chemin, la copie complète (snapshot.job.token) et le chemin des rushes à purger.
--   2 une commande avec une étape cochée est refusée : COMMANDE_COMMENCEE, et rien n'a bougé.
--   3 une commande avec qualité OK est refusée : COMMANDE_COMMENCEE.
--   4 une commande dont une PARTIE est commencée est refusée : COMMANDE_COMMENCEE.
--   5 une commande dont les rushes avaient déjà été purgés n'entre pas dans la liste de purge (files_path null dans le journal).
--   6 un lien perso invalide renvoie {error: LIEN_INVALIDE} sans supprimer.
--   7 job_delete sans session (auth.uid() null) refuse : REFUSE.
-- Les commandes de test portent un jeton 'T9' + chiffres et un client « _Test suppression » ; elles n'existent que le temps du bloc.

do $$
declare v_a uuid; v_b uuid; v_c uuid; v_d uuid; v_e uuid; r jsonb; v_n int; v_msg text; v_tok text;
begin
  -- 0. structure
  if to_regclass('public.jobs_deleted') is null then raise exception 'TEST 0 KO : table jobs_deleted absente'; end if;
  if to_regprocedure('_job_delete_apply(uuid, text, text)') is null or to_regprocedure('job_delete(uuid)') is null
     or to_regprocedure('team_job_delete(text, uuid)') is null then raise exception 'TEST 0 KO : fonction manquante'; end if;
  if has_function_privilege('authenticated', '_job_delete_apply(uuid, text, text)', 'execute') then raise exception 'TEST 0 KO : _job_delete_apply ouverte à authenticated'; end if;
  if has_function_privilege('anon', 'job_delete(uuid)', 'execute') then raise exception 'TEST 0 KO : job_delete ouverte à anon'; end if;
  if not has_function_privilege('authenticated', 'job_delete(uuid)', 'execute') then raise exception 'TEST 0 KO : job_delete fermée à authenticated'; end if;
  if not has_function_privilege('anon', 'team_job_delete(text, uuid)', 'execute') then raise exception 'TEST 0 KO : team_job_delete fermée à anon'; end if;

  -- 1. pas commencée → supprimée + journal
  insert into jobs (token, client_slug, client_name, project, source, files_path, files_downloaded_at)
    values ('T9' || lpad((floor(random() * 100000))::text, 5, '0'), 'test-suppression', '_Test suppression', 'Épisode test A', 'manual', 'D:\DS Rushes\_Test\A', now())
    returning id, token into v_a, v_tok;
  select count(*) into v_n from job_parts where job_id = v_a;
  if v_n < 1 then raise exception 'TEST 1 KO : la commande de test n''a pas de partie (lot C absent ?)'; end if;
  r := _job_delete_apply(v_a, 'Test · dispatch', 'link');
  if coalesce((r->>'ok')::boolean, false) is not true then raise exception 'TEST 1 KO : retour % ', r; end if;
  if exists (select 1 from jobs where id = v_a) then raise exception 'TEST 1 KO : la commande est encore là'; end if;
  if exists (select 1 from job_parts where job_id = v_a) then raise exception 'TEST 1 KO : la partie n''a pas suivi (cascade)'; end if;
  select count(*) into v_n from jobs_deleted d where d.job_id = v_a and d.token = v_tok and d.deleted_by = 'Test · dispatch' and d.deleted_via = 'link'
    and d.files_path = 'D:\DS Rushes\_Test\A' and d.purged_at is null and d.snapshot->'job'->>'token' = v_tok and jsonb_array_length(d.snapshot->'parts') >= 1;
  if v_n <> 1 then raise exception 'TEST 1 KO : journal incomplet'; end if;
  if (r->>'files_on_pc')::boolean is not true then raise exception 'TEST 1 KO : files_on_pc attendu true'; end if;

  -- 2. étape cochée → refus
  insert into jobs (token, client_slug, client_name, project, source, started_at)
    values ('T9' || lpad((floor(random() * 100000))::text, 5, '0'), 'test-suppression', '_Test suppression', 'Épisode test B', 'manual', now()) returning id into v_b;
  begin
    r := _job_delete_apply(v_b, 'Test', 'account'); raise exception 'TEST 2 KO : commande commencée supprimée';
  exception when others then
    v_msg := sqlerrm; if v_msg not like 'COMMANDE_COMMENCEE%' then raise exception 'TEST 2 KO : attendu COMMANDE_COMMENCEE, reçu %', v_msg; end if;
  end;
  if not exists (select 1 from jobs where id = v_b) then raise exception 'TEST 2 KO : la commande a disparu malgré le refus'; end if;
  if exists (select 1 from jobs_deleted where job_id = v_b) then raise exception 'TEST 2 KO : journal écrit malgré le refus'; end if;

  -- 3. qualité OK → refus
  insert into jobs (token, client_slug, client_name, project, source)
    values ('T9' || lpad((floor(random() * 100000))::text, 5, '0'), 'test-suppression', '_Test suppression', 'Épisode test C', 'manual') returning id into v_c;
  update jobs set qc_status = 'ok', qc_at = now() where id = v_c;
  begin
    r := _job_delete_apply(v_c, 'Test', 'account'); raise exception 'TEST 3 KO : commande qualité OK supprimée';
  exception when others then
    v_msg := sqlerrm; if v_msg not like 'COMMANDE_COMMENCEE%' then raise exception 'TEST 3 KO : attendu COMMANDE_COMMENCEE, reçu %', v_msg; end if;
  end;

  -- 4. partie commencée → refus
  insert into jobs (token, client_slug, client_name, project, source)
    values ('T9' || lpad((floor(random() * 100000))::text, 5, '0'), 'test-suppression', '_Test suppression', 'Épisode test D', 'manual') returning id into v_d;
  update job_parts set started_at = now() where job_id = v_d;
  begin
    r := _job_delete_apply(v_d, 'Test', 'account'); raise exception 'TEST 4 KO : commande à partie commencée supprimée';
  exception when others then
    v_msg := sqlerrm; if v_msg not like 'COMMANDE_COMMENCEE%' then raise exception 'TEST 4 KO : attendu COMMANDE_COMMENCEE, reçu %', v_msg; end if;
  end;

  -- 5. rushes déjà purgés → pas de purge à refaire
  insert into jobs (token, client_slug, client_name, project, source, files_path, files_downloaded_at, files_purged_at)
    values ('T9' || lpad((floor(random() * 100000))::text, 5, '0'), 'test-suppression', '_Test suppression', 'Épisode test E', 'manual', 'D:\DS Rushes\_Test\E', now(), now()) returning id into v_e;
  r := _job_delete_apply(v_e, 'Test', 'account');
  if (select files_path from jobs_deleted where job_id = v_e) is not null then raise exception 'TEST 5 KO : files_path devrait être null (déjà purgé)'; end if;
  if (r->>'files_on_pc')::boolean is not false then raise exception 'TEST 5 KO : files_on_pc attendu false'; end if;

  -- 6. lien invalide
  r := team_job_delete('0000000000000000000000000000000000000000', v_b);
  if r->>'error' is distinct from 'LIEN_INVALIDE' then raise exception 'TEST 6 KO : attendu LIEN_INVALIDE, reçu %', r; end if;
  if not exists (select 1 from jobs where id = v_b) then raise exception 'TEST 6 KO : commande supprimée par un lien invalide'; end if;

  -- 7. sans session
  begin
    r := job_delete(v_b); raise exception 'TEST 7 KO : job_delete sans session a accepté';
  exception when others then
    v_msg := sqlerrm; if v_msg not like 'REFUSE%' then raise exception 'TEST 7 KO : attendu REFUSE, reçu %', v_msg; end if;
  end;

  raise exception 'TESTS OK : 0 à 7 passent (tout annulé, aucune trace)';
end $$;
