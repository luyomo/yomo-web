create or replace view yomo_example.v_exmployee_work_time as 
  SELECT exmployee_work_time.employee_name AS xlabel,
    exmployee_work_time.working_hours AS yvalue
   FROM exmployee_work_time;