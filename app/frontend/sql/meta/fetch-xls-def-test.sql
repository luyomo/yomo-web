select array_agg(xls_conf) as xls_conf from (

select id, xls_uid, json_object_agg(type, xls_conf) as xls_conf from (
select id, xls_uid, 'xls_conf' as type, json_object_agg(name, xls_conf) as xls_conf
  from (
    select t2.id, t3.cmpt_uid as xls_uid
             , t1.name, case t4.attr_type when 'int' then to_json(t1.value::int)
                                                          when 'boolean' then to_json(t1.value::boolean)
                                                          else to_json(t1.value) end as xls_conf
          from vw_cmpt_conf t1
    inner join vw_page_params t2
            on t1.cmpt_id = t2.attr_value::int
           and t2.page_name = ':url'
           and t2.attr_key = 'cmpt_id'
           and t1.disabled_flag = false
    inner join vw_cmpt_master t3
            on t1.cmpt_id = t3.cmpt_id
     left join vw_excel_attr_type t4
            on t1.name = t4.attr_name
    
    union all
    
    select id, cmpt_uid, 'columns' as type, array_to_json(array_agg(col_attrs  order by col_id)) as col_attr
      from (
               select t2.id, t3.cmpt_uid, json_object_agg(t1.name, t1.value) as col_attrs, t1.col_id
                 from vw_cmpt_col_conf t1
           inner join vw_page_params t2
              on t1.cmpt_id = t2.attr_value::int
             and t2.page_name = ':url'
             and t2.attr_key = 'cmpt_id'
             and t1.disabled_flag = false
      inner join vw_cmpt_master t3
              on t1.cmpt_id = t3.cmpt_id
        group by t1.cmpt_id, t3.cmpt_uid, t1.col_id, t2.id ) t1
         group by id, cmpt_uid
    
    union all
    
    select id, cmpt_uid, 'colHeaders', to_json(array_agg(value order by col_id))
    from (select t2.id, t3.cmpt_uid, t1.col_id, t1.value
                 from vw_cmpt_col_conf t1
           inner join vw_page_params t2
              on t1.cmpt_id = t2.attr_value::int
             and t2.page_name = ':url'
             and t2.attr_key = 'cmpt_id'
             and t1.disabled_flag = false and t1.name = 'name'
      inner join vw_cmpt_master t3
              on t1.cmpt_id = t3.cmpt_id order by t3.cmpt_uid,  t1.col_id
        ) t1 group by id, cmpt_uid
) t1 group by id, xls_uid

union all
    
    select t2.id, t1.cmpt_uid, 'xls_name' as type, to_json(cmpt_name)
      from vw_cmpt_master t1
inner join vw_page_params t2
        on t1.cmpt_id = t2.attr_value::int 
       and t2.page_name = ':url'
       and t2.attr_key = 'cmpt_id'
  group by t2.id, t1.cmpt_uid, cmpt_name

union all

    select t2.id, t1.cmpt_uid, 'xls_id' as type, to_json(t1.cmpt_uid)
      from vw_cmpt_master t1
inner join vw_page_params t2
        on t1.cmpt_id = t2.attr_value::int
       and t2.page_name = ':url'
       and t2.attr_key = 'cmpt_id'
  group by t2.id, t1.cmpt_uid

union all

    select t2.id, t1.cmpt_uid, 'comp_type' as type, to_json(t1.comp_type)
      from vw_cmpt_master t1
inner join vw_page_params t2
        on t1.cmpt_id = t2.attr_value::int
       and t2.page_name = ':url'
       and t2.attr_key = 'cmpt_id'
  group by t2.id, t1.cmpt_uid, t1.comp_type
) t1 group by id, xls_uid order by id
) t1 group by id
