create or replace view yomo.v_cmpt_col_conf as 
  SELECT vw_cmpt_col_conf.cmpt_id,
    vw_cmpt_col_conf.col_id,
    vw_cmpt_col_conf.attr_id,
    vw_cmpt_col_conf.name,
    vw_cmpt_col_conf.value,
    vw_cmpt_col_conf.disabled_flag
   FROM vw_cmpt_col_conf
  ORDER BY vw_cmpt_col_conf.cmpt_id, vw_cmpt_col_conf.col_id, vw_cmpt_col_conf.attr_id;