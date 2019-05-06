create or replace view yomo.v_page_ajax_request as 
  SELECT vw_page_ajax_request.id,
    vw_page_ajax_request.page_name,
    vw_page_ajax_request.event,
    vw_page_ajax_request.comp_id,
    vw_page_ajax_request.ajax_url,
    vw_page_ajax_request.type,
    vw_page_ajax_request.parameters,
    vw_page_ajax_request.callback
   FROM vw_page_ajax_request
  WHERE (vw_page_ajax_request.disabled_flag = false)
  ORDER BY vw_page_ajax_request.id;