CREATE TABLE yomo_template.tpl_vw_page_data_struct (
    template_name character varying(128)  NOT NULL,
    id integer  NOT NULL,
    parent_node character varying(128)  NULL,
    child_node character varying(128)  NULL,
    type character varying(16)  NULL,
    action_name character varying(32)  NULL,
    disable_flag boolean DEFAULT false NULL,
    comment character varying(256)  NULL);