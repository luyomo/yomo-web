CREATE TABLE yomo.vw_cmpt_master (
    cmpt_id integer  NOT NULL,
    cmpt_uid character varying(128)  NULL,
    cmpt_name character varying(128)  NULL,
    comp_type character varying(32) DEFAULT 'excel'::character varying NULL,
    gui_seq integer  NULL,
    comment character varying(256)  NULL,
    disabled_flag boolean DEFAULT false NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);