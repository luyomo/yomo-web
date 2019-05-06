create or replace view yomo.vu_cmpt_master as 
  SELECT vw_cmpt_master.cmpt_id,
    vw_cmpt_master.cmpt_uid,
    vw_cmpt_master.cmpt_name,
    vw_cmpt_master.comp_type,
    vw_cmpt_master.gui_seq,
    vw_cmpt_master.comment
   FROM vw_cmpt_master
  WHERE ((vw_cmpt_master.disabled_flag = false) AND (vw_cmpt_master.cmpt_id < 90000))
  ORDER BY vw_cmpt_master.cmpt_id;