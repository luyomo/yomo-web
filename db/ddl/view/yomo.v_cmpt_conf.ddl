create or replace view yomo.v_cmpt_conf as 
  SELECT vw_cmpt_conf.cmpt_id,
    vw_cmpt_conf.attr_id,
    vw_cmpt_conf.name,
    vw_cmpt_conf.value,
    vw_cmpt_conf.data_type,
    vw_cmpt_conf.disabled_flag
   FROM vw_cmpt_conf
  WHERE (((vw_cmpt_conf.cmpt_id % 100) >= 11) AND ((vw_cmpt_conf.cmpt_id % 100) <= 19))
  ORDER BY vw_cmpt_conf.cmpt_id, vw_cmpt_conf.attr_id;