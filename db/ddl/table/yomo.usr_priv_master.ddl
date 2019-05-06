CREATE TABLE yomo.usr_priv_master (
    id integer  NOT NULL,
    role_name character varying(32)  NOT NULL,
    object_name character varying(128)  NOT NULL,
    object_type character varying(32) DEFAULT 'menu'::character varying NULL,
    priv character varying(32)  NULL,
    start_date timestamp without time zone  NULL,
    thru_date timestamp without time zone  NULL,
    comment text  NULL,
    created_by character varying(128)  NULL,
    create_date timestamp without time zone  NULL);