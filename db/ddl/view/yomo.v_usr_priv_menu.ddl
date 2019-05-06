create or replace view yomo.v_usr_priv_menu as 
  SELECT usr_priv_master.id,
    usr_priv_master.role_name,
    usr_priv_master.object_name,
    usr_priv_master.priv
   FROM usr_priv_master
  WHERE (((CURRENT_TIMESTAMP >= usr_priv_master.start_date) AND (CURRENT_TIMESTAMP <= COALESCE(usr_priv_master.thru_date, '9999-01-01 00:00:00'::timestamp without time zone))) AND ((usr_priv_master.object_type)::text = 'menu'::text));