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
-- Name: em_group_2_mail; Type: TABLE; Schema: yomo; Owner: yomo
--

CREATE TABLE em_group_2_mail (
    group_id integer NOT NULL,
    em_tpl_id integer NOT NULL
);


ALTER TABLE em_group_2_mail OWNER TO yomo;

--
-- Name: em_group_2_mail em_group_2_mail_pkey; Type: CONSTRAINT; Schema: yomo; Owner: yomo
--

ALTER TABLE ONLY em_group_2_mail
    ADD CONSTRAINT em_group_2_mail_pkey PRIMARY KEY (group_id, em_tpl_id);


--
-- PostgreSQL database dump complete
--

