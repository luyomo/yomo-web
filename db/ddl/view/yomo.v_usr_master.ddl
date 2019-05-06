create or replace view yomo.v_usr_master as 
  SELECT usr_master.role_name,
    usr_master.role_type
   FROM usr_master
  WHERE ((CURRENT_DATE >= usr_master.start_date) AND (CURRENT_DATE <= COALESCE(usr_master.thru_date, '9999-01-01'::date)));