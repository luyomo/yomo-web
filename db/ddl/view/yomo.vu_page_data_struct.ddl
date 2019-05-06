create or replace view yomo.vu_page_data_struct as 
  SELECT vw_page_data_struct.id,
    vw_page_data_struct.parent_node,
    vw_page_data_struct.child_node,
    vw_page_data_struct.type,
    vw_page_data_struct.action_name,
    vw_page_data_struct.comment
   FROM vw_page_data_struct
  WHERE ((vw_page_data_struct.disable_flag = false) AND (vw_page_data_struct.id < 90000))
  ORDER BY vw_page_data_struct.id;