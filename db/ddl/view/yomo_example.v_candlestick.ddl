create or replace view yomo_example.v_candlestick as 
  SELECT to_char((candlestick.date)::timestamp with time zone, 'yyyy-mm-dd'::text) AS valuedate,
    candlestick.open,
    candlestick.close,
    candlestick.high,
    candlestick.low,
    candlestick.volume
   FROM candlestick
  ORDER BY (to_char((candlestick.date)::timestamp with time zone, 'yyyy-mm-dd'::text));