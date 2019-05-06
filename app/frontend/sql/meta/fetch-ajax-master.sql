select event, comp_id, array_agg(ajax_url) as ajax_urls 
from vw_page_ajax_request 
where page_name = ${url} and disabled_flag = false group by event, comp_id
