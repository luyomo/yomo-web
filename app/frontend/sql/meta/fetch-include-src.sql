with recursive wt_url(seq, parent_node, child_node) as (
  select 1 , parent_node, child_node from vw_page_data_struct 
   where parent_node = ${url}
     and type = 'template'
union all
  select t1.seq + 1, t2.parent_node, t2.child_node from wt_url t1, vw_page_data_struct t2 
   where t1.child_node = t2.parent_node
), wt_url_list as (
  select distinct seq, parent_node as page_name from wt_url)
    select replace(t2.src_file, '#-{root_path}', ${root_path} ) as src_file
         , t2.type
      from wt_url_list t1
inner join vw_page_include t2
        on t1.page_name = t2.page_name
  order by t1.seq desc, t2.id
