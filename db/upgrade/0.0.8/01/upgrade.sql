alter table yomo.vw_cmpt_master rename to vw_cmpt_master_2rm;                                                      

create table yomo.vw_cmpt_master(cmpt_id int primary key, cmpt_uid varchar(128), cmpt_name varchar(128)           
, comp_type varchar(32) default 'excel', gui_seq int, comment varchar(256)                                        
, disabled_flag boolean default false, created_by varchar(32) default current_user                                
, created_at timestamp default current_timestamp                                                                  
, updated_by varchar(32) default current_user, updated_at timestamp default current_timestamp);                    

drop view yomo.vu_cmpt_master;                                                                                    

create view yomo.vu_cmpt_master as                                                                                
 SELECT  cmpt_id, cmpt_uid, cmpt_name, comp_type, gui_seq, comment                                                 
 from vw_cmpt_master where disabled_flag = false AND cmpt_id < 90000 ORDER BY cmpt_id;                             

drop view yomo.v_cmpt_master;                                                                                     

create view yomo.v_cmpt_master as
SELECT vw_cmpt_master.cmpt_id,
    vw_cmpt_master.cmpt_uid,
    vw_cmpt_master.cmpt_name,
    vw_cmpt_master.comp_type,
    vw_cmpt_master.gui_seq,
    vw_cmpt_master.comment
   FROM vw_cmpt_master
  WHERE ((vw_cmpt_master.comp_type)::text = ANY (ARRAY[('excel'::character varying)::text, ('chart'::character varying)::text]))
  and vw_cmpt_master.disabled_flag = false
  ORDER BY vw_cmpt_master.cmpt_id;

drop view yomo.v_cmpt_btn_master;                                                                                 
create view yomo.v_cmpt_btn_master as                                                                             
SELECT vw_cmpt_master.cmpt_id,                                                                                    
    vw_cmpt_master.cmpt_uid,                                                                                      
    vw_cmpt_master.cmpt_name,                                                                                     
    vw_cmpt_master.comp_type,                                                                                     
    vw_cmpt_master.gui_seq,                                                                                       
    vw_cmpt_master.comment,                                                                                       
    vw_cmpt_master.disabled_flag                                                                                  
   FROM vw_cmpt_master                                                                                            
  WHERE vw_cmpt_master.comp_type::text = ANY (ARRAY['button'::text, 'input'::text])                               
  ORDER BY vw_cmpt_master.cmpt_id;                                                                                
                                                                                                                       
drop view yomo.v_menu_list;                                                                                       
create view yomo.v_menu_list as                                                                                   
 SELECT t2.id,                                                                                                    
    t2.pid,                                                                                                       
    t2.display,                                                                                                   
    t2.display_jp,                                                                                                
    t2.href,                                                                                                      
    array_agg(t4.cmpt_id) AS cmpt_id_list                                                                         
   FROM vw_page_data_struct t1                                                                                    
     JOIN vw_menu t2 ON t1.parent_node::text ~ replace(t2.href::text, 'main.html'::text, ''::text)                
     JOIN vw_page_params t3 ON t1.id = t3.data_id                                                                 
     JOIN vw_cmpt_master t4 ON t3.attr_value::integer = t4.cmpt_id AND t3.attr_key::text = 'cmpt_id'::text        
  GROUP BY t2.id, t2.pid, t2.display, t2.display_jp, t2.href;                                                     

                                                                                                                       
insert into vw_cmpt_master select cmpt_id, cmpt_uid, cmpt_name, comp_type                                          
, cmpt_id, comment, disabled_flag, created_by, created_at, updated_by, updated_at                                 
from vw_cmpt_master_2rm ;                                                                                         
                                                                                                                       
update vw_cmpt_col_conf set col_id = 6 where cmpt_id = 90212 and col_id = 5;                                       
insert into vw_cmpt_col_conf select cmpt_id, 5, attr_id, name, value, disabled_flag                                
, created_by, current_timestamp, updated_by, current_timestamp from vw_cmpt_col_conf                              
where (cmpt_id, col_id) = (90212, 1) and attr_id <> 8;                                                            
update vw_cmpt_col_conf set value = 'GUI SEQ' where (cmpt_id, col_id) = (90212, 5) and attr_id in (1,4);           
update vw_cmpt_col_conf set value = 'gui_seq' where (cmpt_id, col_id,attr_id) = (90212, 5, 3);  
