CREATE TABLE yomo_template.tpl_vw_cmpt_col_conf (
    template_name character varying(128)  NOT NULL,
    cmpt_id integer  NOT NULL,
    col_id integer  NOT NULL,
    attr_id integer  NOT NULL,
    name character varying(32)  NOT NULL,
    value text  NOT NULL);