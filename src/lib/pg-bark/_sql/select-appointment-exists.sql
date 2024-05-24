-- (appointmentId)

SELECT
    num_appointments = 1 as "appointmentExists"
FROM (
    SELECT COUNT(*) as num_appointments
    FROM calls
    WHERE call_id = $1
    AND call_outcome = 'APPOINTMENT'
) as tCount
