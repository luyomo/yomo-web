    select cmpt_uid, cmpt_name, comp_type
         , case sum(case when t3.name is not null then 1 else 0 end) when 0 
           then null 
           else json_object_agg(coalesce(t3.name, 'NULL'), t3.value) end as col_attrs   
      from vw_page_params t1 
inner join vw_cmpt_master t2 
        on t1.page_name = ${url}
       and t1.attr_key = 'cmpt_id' 
       and t1.attr_value::int = t2.cmpt_id
 left join vw_cmpt_conf t3 
        on t2.cmpt_id = t3.cmpt_id 
       and t3.disabled_flag = false 
  group by t2.cmpt_id, cmpt_uid, cmpt_name, comp_type
  order by t2.cmpt_id
