create or replace view yomo.vu_page_params as 
  SELECT vw_page_params.id,
    vw_page_params.page_name,
    vw_page_params.data_id,
    vw_page_params.attr_key,
    vw_page_params.attr_value,
    vw_page_params.comment
   FROM vw_page_params
  WHERE ((vw_page_params.disabled_flag = false) AND (vw_page_params.id < 90000))
  ORDER BY vw_page_params.id;