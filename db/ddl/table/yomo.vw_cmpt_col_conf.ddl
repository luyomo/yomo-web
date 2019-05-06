CREATE TABLE yomo.vw_cmpt_col_conf (
    cmpt_id integer  NOT NULL,
    col_id integer  NOT NULL,
    attr_id integer  NOT NULL,
    name character varying(32)  NOT NULL,
    value text DEFAULT NULL::character varying NULL,
    disabled_flag boolean DEFAULT false NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);