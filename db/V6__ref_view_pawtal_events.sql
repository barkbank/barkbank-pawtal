CREATE VIEW view_pawtal_events
WITH (security_invoker=on)
AS
SELECT
  *,
  (event_ts AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Singapore')::date AS "day"
FROM pawtal_events;
