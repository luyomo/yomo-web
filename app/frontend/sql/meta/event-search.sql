with recursive base_tbl as ( 
  select id, parent_node, child_node, cast('{' || case type when 'template' then null else id end || '}' as integer[]) as id_router 
           , cast ('{' || case type when 'template' then null else child_node end || '}' as varchar[]) as router, action_name, type, disable_flag 
    from vw_page_data_struct 
   where parent_node = ${url} 
 union all 
  select t2.id, t1.parent_node, t2.child_node, array_append(t1.id_router, t2.id) as id_router 
              , array_append(t1.router, t2.child_node) as router, t2.action_name, t2.type, t2.disable_flag 
    from base_tbl t1, vw_page_data_struct t2 
   where t1.child_node = t2.parent_node)

select id, parent_node, router, action_name,  json_object_agg(attr_key, attr_value) as params 
  from ( 
    select id, parent_node, router, action_name,coalesce(attr_key, '_no_data_') as attr_key ,attr_value                    
      from ( 
        select id, parent_node, router, attr_key, attr_value, action_name 
                  , row_number () over (partition by id, parent_node, router, action_name, attr_key order by idx desc) as idx 
          from (
            select t1.id, t1.parent_node, id_router, router, t2.page_name, t2.attr_key, t2.attr_value
                        , t1.action_name, idx(t1.id_router, t2.data_id) as idx 
              from base_tbl t1 
         left join vw_page_params t2 
                on t2.data_id = any( t1.id_router) 
               and t2.page_name = t1.parent_node 
             where t1.type = 'leaf' 
               and t1.disable_flag = false) t1 
            ) t1 where idx = 1 
       ) t1 group by id, parent_node, router, action_name;
