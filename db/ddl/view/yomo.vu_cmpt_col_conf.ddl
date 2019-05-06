create or replace view yomo.vu_cmpt_col_conf as 
  SELECT vw_cmpt_col_conf.cmpt_id,
    vw_cmpt_col_conf.col_id,
    vw_cmpt_col_conf.attr_id,
    vw_cmpt_col_conf.name,
    vw_cmpt_col_conf.value
   FROM vw_cmpt_col_conf
  WHERE ((vw_cmpt_col_conf.disabled_flag = false) AND (vw_cmpt_col_conf.cmpt_id < 90000))
  ORDER BY vw_cmpt_col_conf.cmpt_id, vw_cmpt_col_conf.col_id, vw_cmpt_col_conf.attr_id;