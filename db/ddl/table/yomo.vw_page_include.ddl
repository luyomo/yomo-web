CREATE TABLE yomo.vw_page_include (
    id integer  NOT NULL,
    page_name character varying(128)  NOT NULL,
    src_file character varying(128)  NOT NULL,
    type character varying(32)  NULL,
    disabled_flag boolean DEFAULT false NULL,
    comment text  NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);