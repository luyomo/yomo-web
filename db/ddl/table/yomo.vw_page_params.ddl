CREATE TABLE yomo.vw_page_params (
    id integer  NOT NULL,
    page_name character varying(128) DEFAULT NULL::character varying NULL,
    data_id integer  NULL,
    attr_key character varying(32) DEFAULT NULL::character varying NULL,
    attr_value character varying(256) DEFAULT NULL::character varying NULL,
    comment text  NULL,
    disabled_flag boolean DEFAULT false NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);