CREATE TABLE yomo.general_conf (
    category character varying(32)  NOT NULL,
    id integer  NOT NULL,
    attr_key character varying(64)  NOT NULL,
    attr_value character varying(64)  NOT NULL,
    comment character varying(128)  NULL,
    disabled_flag boolean DEFAULT false NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);