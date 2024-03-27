CREATE VIEW dog_statuses AS (
    SELECT
        tLatest.dog_id,
        tLatest.user_id,
        CASE
            WHEN tLatest.latest_user_residency = 'SINGAPORE' THEN 'AVAILABLE'::t_service_status
            ELSE 'UNAVAILABLE'::t_service_status
        END as service_status
    FROM latest_values as tLatest
);
