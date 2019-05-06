  select query, parameters, query_type, comp_name 
    from vw_queries 
   where id = ${query_id} 
order by subid
