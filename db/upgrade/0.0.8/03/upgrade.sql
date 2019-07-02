alter table yomo.usr_priv_master rename to usr_priv_master_2rm;

create table yomo.usr_priv_master (
  id int primary key
, role_name varchar(32) not null
, object_name varchar(128) not null
, object_type varchar(32) default 'menu'
, priv varchar(32)
, start_date timestamp
, thru_date timestamp
, comment text
, created_by varchar(128)
, create_date timestamp);

insert into yomo.usr_priv_master
(id, role_name, object_name, priv, start_date, thru_date, comment, created_by, create_date)
select id, role_name, object_name, priv, start_date, thru_date, comment, created_by, create_date 
from yomo.usr_priv_master_2rm;

create view yomo.v_usr_priv_ajax as
select id, role_name, object_name, priv from yomo.usr_priv_master 
where current_timestamp between start_date 
  and coalesce(thru_date, '9999-01-01') 
  and object_type = 'ajax';

create view yomo.v_usr_priv_menu as 
select id, role_name, object_name, priv from yomo.usr_priv_master 
 where current_timestamp between start_date 
   and coalesce(thru_date, '9999-01-01') 
   and object_type = 'menu';

create or replace view yomo.v_usr_master as 
  SELECT usr_master.role_name,
    usr_master.role_type
   FROM usr_master
  WHERE ((CURRENT_DATE >= usr_master.start_date) AND (CURRENT_DATE <= COALESCE(usr_master.thru_date, '9999-01-01'::date
)));

drop table yomo.usr_priv_master_2rm;

insert into yomo.vw_page_ajax_request values (90233                                               
  , '/system/maintenance/excel/yomo-ajax-master.ajax', 'load', null                                              
  , '/yomo-kf-bg/api/page-permission.rest', false, 'GET', null, 'onPagePermission'                               
  , 'yomo', current_timestamp, 'yomo', current_timestamp);

insert into yomo.usr_priv_master values 
( 101, 'role-sys-rw', '/system/maintenance/excel/yomo-ajax-master.ajax', 'ajax', 'r'
, '2018-01-01 00:00:00', null, null, '0.0.8 release', current_timestamp);

CREATE FUNCTION yomo.idx(anyarray, anyelement) RETURNS integer                                                        
    LANGUAGE sql IMMUTABLE
    AS $body$
  SELECT i FROM (
     SELECT generate_series(array_lower($1,1),array_upper($1,1))                                                      
  ) g(i)
  WHERE $1[i] = $2
  LIMIT 1;
$body$;
