CREATE TABLE yomo.vw_page_data_struct (
    id integer  NOT NULL,
    parent_node character varying(128) DEFAULT NULL::character varying NULL,
    child_node character varying(128) DEFAULT NULL::character varying NULL,
    type character varying(16) DEFAULT NULL::character varying NULL,
    action_name character varying(32) DEFAULT NULL::character varying NULL,
    disable_flag boolean DEFAULT false NULL,
    comment character varying(256)  NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);