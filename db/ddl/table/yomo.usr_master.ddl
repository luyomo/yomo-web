CREATE TABLE yomo.usr_master (
    role_name character varying(32)  NOT NULL,
    role_type character(1)  NOT NULL,
    start_date date  NOT NULL,
    thru_date date  NULL,
    comment text  NULL,
    created_by character varying(32)  NULL,
    created_date date  NULL);