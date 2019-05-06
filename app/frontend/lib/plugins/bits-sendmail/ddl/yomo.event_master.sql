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
-- Name: event_master; Type: TABLE; Schema: yomo; Owner: yomo
--

CREATE TABLE event_master (
    id integer NOT NULL,
    page_name character varying(128),
    event_name character varying(128),
    seq integer,
    call_back character varying(128),
    disabled_flag boolean,
    start_date date,
    thru_date date,
    create_date timestamp without time zone,
    create_by character varying(128),
    update_date timestamp without time zone,
    update_by character varying(128)
);


ALTER TABLE event_master OWNER TO yomo;

--
-- Name: event_master event_master_pkey; Type: CONSTRAINT; Schema: yomo; Owner: yomo
--

ALTER TABLE ONLY event_master
    ADD CONSTRAINT event_master_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

