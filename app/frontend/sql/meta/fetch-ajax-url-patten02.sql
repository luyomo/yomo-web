select row_to_json(t1) as ajax_url 
  from (select ajax_url
             , type
             , callback
             , parameters 
             , t2.cmpt_uid
          from (select * from vw_page_ajax_request where page_name = ${url} and event='load') t1
     left join vw_cmpt_master t2
            on t1.comp_id::int = t2.cmpt_id) t1
