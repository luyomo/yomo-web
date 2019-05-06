with recursive base_tbl as (
    select t1.role_name,
           t1.object_name,
           t1.priv
    from   yomo.v_usr_priv_menu t1
    inner  join yomo.v_usr_master t2
    on     t1.role_name = t2.role_name
    union all
    select t2.child_role ,
           t1.object_name,
           t1.priv
    from   yomo.usr_role_rel t2,
           base_tbl t1
    where  t1.role_name = t2.parent_role
),
user_lang as (select lang from yomo.user_lang  where user_name = ${user_name})
select m2.id,
       m2.pid,
       case when m1.lang='name' then display else display_jp end as display,
       m2.href,
       m2.has_children
from user_lang m1, yomo.vw_menu m2
join (
select distinct object_name
from   base_tbl
where  role_name = ${user_name}
) m3
on m2.href like m3.object_name || '%'
where m2.disable_flag = 'f'
order by m2.gui_seq, m2.id, m2.pid;

