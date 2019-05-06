create or replace view yomo.v_vw_cmpt_col_info as 
  WITH wt_base AS (
         SELECT vw_cmpt_col_conf.cmpt_id,
            vw_cmpt_col_conf.col_id,
            vw_cmpt_col_conf.attr_id,
            vw_cmpt_col_conf.name,
            vw_cmpt_col_conf.value,
            vw_cmpt_col_conf.disabled_flag
           FROM vw_cmpt_col_conf
          WHERE ((vw_cmpt_col_conf.disabled_flag = false) OR (vw_cmpt_col_conf.disabled_flag IS NULL))
        )
 SELECT wt_base.cmpt_id,
    wt_base.col_id,
    wt_base.attr_id,
    wt_base.name,
    execute_query((replace(wt_base.value, 'QUERY:'::text, ''::text))::character varying) AS value
   FROM wt_base
  WHERE (wt_base.value ~ '^QUERY:'::text)
UNION ALL
 SELECT wt_base.cmpt_id,
    wt_base.col_id,
    wt_base.attr_id,
    wt_base.name,
    wt_base.value
   FROM wt_base
  WHERE (wt_base.value !~ '^QUERY:'::text);