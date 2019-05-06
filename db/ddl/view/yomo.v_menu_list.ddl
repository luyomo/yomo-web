create or replace view yomo.v_menu_list as 
  SELECT t2.id,
    t2.pid,
    t2.display,
    t2.display_jp,
    t2.href,
    t2.gui_seq,
    array_agg(t4.cmpt_id) AS cmpt_id_list
   FROM (((vw_page_data_struct t1
     JOIN vw_menu t2 ON (((t1.parent_node)::text ~ replace((t2.href)::text, 'main.html'::text, ''::text))))
     JOIN vw_page_params t3 ON ((t1.id = t3.data_id)))
     JOIN vw_cmpt_master t4 ON ((((t3.attr_value)::integer = t4.cmpt_id) AND ((t3.attr_key)::text = 'cmpt_id'::text))))
  GROUP BY t2.id, t2.pid, t2.display, t2.display_jp, t2.href, t2.gui_seq;