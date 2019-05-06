CREATE TABLE yomo.vw_cmpt_conf (
    cmpt_id integer  NOT NULL,
    attr_id integer  NOT NULL,
    name character varying(32)  NOT NULL,
    value text  NOT NULL,
    disabled_flag boolean DEFAULT false NULL,
    data_type character varying(32)  NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);