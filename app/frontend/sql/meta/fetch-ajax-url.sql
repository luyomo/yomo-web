  select row_to_json(t1) as ajax_url from (
    select t1.ajax_url
         , t2.type
         , t2.callback
         , t2.parameters 
      from vw_page_ajax_request t1 
inner join vw_ajax_master t2 
        on t1.ajax_url = t2.ajax_url
       and t1.disabled_flag = false 
       and t1.page_name = ${url}
       and event = 'load') t1
