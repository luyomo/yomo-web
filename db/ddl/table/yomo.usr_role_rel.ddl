CREATE TABLE yomo.usr_role_rel (
    parent_role character varying(32)  NOT NULL,
    child_role character varying(32)  NOT NULL,
    start_date date  NOT NULL,
    thru_date date  NULL,
    created_by character varying(32)  NULL,
    created_date date  NULL);