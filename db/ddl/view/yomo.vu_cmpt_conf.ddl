create or replace view yomo.vu_cmpt_conf as 
  SELECT vw_cmpt_conf.cmpt_id,
    vw_cmpt_conf.attr_id,
    vw_cmpt_conf.name,
    vw_cmpt_conf.value,
    vw_cmpt_conf.data_type
   FROM vw_cmpt_conf
  WHERE ((vw_cmpt_conf.disabled_flag = false) AND (vw_cmpt_conf.cmpt_id < 90000))
  ORDER BY vw_cmpt_conf.cmpt_id, vw_cmpt_conf.attr_id;