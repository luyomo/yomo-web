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
-- Name: em_tpl_content; Type: TABLE; Schema: yomo; Owner: yomo
--

CREATE TABLE em_tpl_content (
    id integer,
    mail_template text
);


ALTER TABLE em_tpl_content OWNER TO yomo;

--
-- PostgreSQL database dump complete
--

