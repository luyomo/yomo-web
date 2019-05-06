CREATE TABLE yomo_template.tpl_vw_page_params (
    template_name character varying(128)  NOT NULL,
    id integer  NOT NULL,
    page_name character varying(128)  NULL,
    data_id integer  NULL,
    attr_key character varying(32)  NULL,
    attr_value character varying(64)  NULL,
    comment text  NULL);