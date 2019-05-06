alter table vw_menu rename to vw_menu_2rm;

create table yomo.vw_menu (
 id            integer        primary key,
 pid           integer                      not null,
 display       character varying(128)       default NULL::character varying,
 href          character varying(128)       default NULL::character varying,
 display_jp    character varying(128)     ,
 gui_seq       int default 1     ,
 has_children  boolean                      default true,
 disable_flag  boolean                      default false,
 created_by    character varying(32)        default CURRENT_USER,
 created_at    timestamp without time zone  default CURRENT_TIMESTAMP,                                                 
 updated_by    character varying(32)        default CURRENT_USER,                                                      
 update_at     timestamp without time zone  default CURRENT_TIMESTAMP,
 primary key(id, pid)                                                  
 );                                                                                                                    

drop view v_menu;                                                                                                  

create view yomo.v_menu as                                                                                         
 SELECT vw_menu.id,                                                                                                    
    vw_menu.pid,                                                                                                       
    vw_menu.display,                                                                                                   
    vw_menu.href,                                                                                                      
    vw_menu.display_jp,                                                                                                
    vw_menu.gui_seq,                                                                                                   
    vw_menu.has_children                                                                                               
   FROM vw_menu                                                                                                        
  WHERE vw_menu.disable_flag = false                                                                                   
  ORDER BY vw_menu.pid, vw_menu.id;                                                                                    
                                                                                                                       
drop view yomo.vu_menu;                                                                                           
create view yomo.vu_menu as                                                                                       
 SELECT vw_menu.id,                                                                                                    
    vw_menu.pid,                                                                                                       
    vw_menu.display,                                                                                                   
    vw_menu.href,                                                                                                      
    vw_menu.display_jp,                                                                                                
    vw_menu.gui_seq,                                                                                                   
    vw_menu.has_children                                                                                               
   FROM vw_menu                                                                                                        
  WHERE vw_menu.disable_flag = false AND vw_menu.id < 90000                                                            
  ORDER BY vw_menu.id;                                                                                                 
                                                                                                                       
drop view yomo.v_menu_list;                                                                                       
create view yomo.v_menu_list as                                                                                   
 SELECT t2.id,                                                                                                         
    t2.pid,                                                                                                            
    t2.display,                                                                                                        
    t2.display_jp,                                                                                                     
    t2.href,                                                                                                           
    t2.gui_seq,                                                                                                        
    array_agg(t4.cmpt_id) AS cmpt_id_list                                                                              
   FROM vw_page_data_struct t1                                                                                         
     JOIN vw_menu t2 ON t1.parent_node::text ~ replace(t2.href::text, 'main.html'::text, ''::text)                     
     JOIN vw_page_params t3 ON t1.id = t3.data_id                                                                      
     JOIN vw_cmpt_master t4 ON t3.attr_value::integer = t4.cmpt_id AND t3.attr_key::text = 'cmpt_id'::text             
  GROUP BY t2.id, t2.pid, t2.display, t2.display_jp, t2.href, t2.gui_seq                                               
insert into yomo.vw_menu select  id, pid, display, href, display_jp, id, has_children, disable_flag               
    , created_by, created_at, updated_by, update_at from yomo.vw_menu_2rm;                                             
drop table yomo.vw_menu_2rm;                                                                                      
insert into v_cmpt_col_conf select cmpt_id, 7, attr_id, name, value, disabled_flag                                
  from v_cmpt_col_conf where (cmpt_id, col_id) = (90111, 2);                                                        
update v_cmpt_col_conf set value = 'GUI Seq' where (cmpt_id, col_id) = (90111, 7) and  attr_id in (1,4);          
update v_cmpt_col_conf set value = 'gui_seq' where (cmpt_id, col_id) = (90111, 7) and  attr_id = 3; 
