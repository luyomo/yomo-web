create or replace view yomo.v_xls_col_id_2_name as 
  SELECT general_conf.attr_key,
    general_conf.attr_value,
    general_conf.comment
   FROM general_conf
  WHERE ((general_conf.category)::text = 'xls-col-id-2-name'::text);