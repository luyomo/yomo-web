CREATE FUNCTION yomo.execute_query(query character varying) RETURNS SETOF character varying
    LANGUAGE plpgsql
    AS $BODY$
BEGIN
  RETURN QUERY
     EXECUTE query;
  RETURN;
END;
$BODY$
