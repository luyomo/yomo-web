--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 9.6.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = yomo, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: em_users; Type: TABLE; Schema: yomo; Owner: yomo
--

CREATE TABLE em_users (
    id integer,
    group_id integer,
    email_addr character varying(64),
    disabled_flag boolean,
    start_date date,
    thru_date date,
    create_date timestamp without time zone,
    create_by character varying(128),
    update_date timestamp without time zone,
    update_by character varying(128)
);


ALTER TABLE em_users OWNER TO yomo;

--
-- PostgreSQL database dump complete
--

