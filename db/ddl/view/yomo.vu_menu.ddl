create or replace view yomo.vu_menu as 
  SELECT vw_menu.id,
    vw_menu.pid,
    vw_menu.display,
    vw_menu.href,
    vw_menu.display_jp,
    vw_menu.gui_seq,
    vw_menu.has_children
   FROM vw_menu
  WHERE ((vw_menu.disable_flag = false) AND (vw_menu.id < 90000))
  ORDER BY vw_menu.id;