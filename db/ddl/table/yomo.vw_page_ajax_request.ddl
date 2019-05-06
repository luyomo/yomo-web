CREATE TABLE yomo.vw_page_ajax_request (
    id integer DEFAULT nextval('vw_page_ajax_request_id_seq'::regclass) NOT NULL,
    page_name character varying(128)  NOT NULL,
    event character varying(32)  NOT NULL,
    comp_id character varying(128)  NULL,
    ajax_url character varying(128)  NULL,
    disabled_flag boolean DEFAULT false NULL,
    type character varying(16) DEFAULT 'GET'::character varying NOT NULL,
    parameters json  NULL,
    callback character varying(128)  NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);