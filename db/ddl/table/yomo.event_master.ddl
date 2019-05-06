CREATE TABLE yomo.event_master (
    id integer  NOT NULL,
    page_name character varying(128)  NULL,
    event_name character varying(128)  NULL,
    seq integer  NULL,
    call_back character varying(128)  NULL,
    disabled_flag boolean  NULL,
    start_date date  NULL,
    thru_date date  NULL,
    create_date timestamp without time zone  NULL,
    create_by character varying(128)  NULL,
    update_date timestamp without time zone  NULL,
    update_by character varying(128)  NULL);