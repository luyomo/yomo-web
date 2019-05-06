CREATE FUNCTION yomo.idx(anyarray, anyelement) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $body$
  SELECT i FROM (
     SELECT generate_series(array_lower($1,1),array_upper($1,1))
  ) g(i)
  WHERE $1[i] = $2
  LIMIT 1;
$body$;
