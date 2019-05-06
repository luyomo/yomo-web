create or replace view yomo.v_page_include as 
  SELECT vw_page_include.id,
    vw_page_include.page_name,
    vw_page_include.src_file,
    vw_page_include.type,
    vw_page_include.disabled_flag,
    vw_page_include.comment
   FROM vw_page_include
  WHERE (vw_page_include.id < 90000)
  ORDER BY vw_page_include.page_name, vw_page_include.id;