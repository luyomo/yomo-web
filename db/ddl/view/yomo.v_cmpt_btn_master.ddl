create or replace view yomo.v_cmpt_btn_master as 
  SELECT vw_cmpt_master.cmpt_id,
    vw_cmpt_master.cmpt_uid,
    vw_cmpt_master.cmpt_name,
    vw_cmpt_master.comp_type,
    vw_cmpt_master.gui_seq,
    vw_cmpt_master.comment,
    vw_cmpt_master.disabled_flag
   FROM vw_cmpt_master
  WHERE ((vw_cmpt_master.comp_type)::text = ANY (ARRAY['button'::text, 'input'::text]))
  ORDER BY vw_cmpt_master.cmpt_id;