CREATE TABLE yomo.vw_menu (
    id integer  NOT NULL,
    pid integer  NOT NULL,
    display character varying(128) DEFAULT NULL::character varying NULL,
    href character varying(128) DEFAULT NULL::character varying NULL,
    display_jp character varying(128)  NULL,
    gui_seq integer DEFAULT 1 NULL,
    has_children boolean DEFAULT true NULL,
    disable_flag boolean DEFAULT false NULL,
    created_by character varying(32) DEFAULT CURRENT_USER NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL,
    updated_by character varying(32) DEFAULT CURRENT_USER NULL,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NULL);