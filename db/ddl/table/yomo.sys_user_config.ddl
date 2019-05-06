CREATE TABLE yomo.sys_user_config (
    user_name character varying(32)  NOT NULL,
    config_type character varying(32)  NOT NULL,
    config_value character varying(128)  NOT NULL,
    created_by character varying(128)  NULL,
    created_date date DEFAULT ('now'::text)::date NULL);