CREATE VIEW dog_statuses AS (
    WITH
    mServiceStatuses as (
        SELECT
            user_id,
            CASE
                WHEN user_residency = 'SINGAPORE' THEN 'AVAILABLE'::t_service_status
                ELSE 'UNAVAILABLE'::t_service_status
            END as service_status
        FROM users
    ),
    mTail as (SELECT 1)

    SELECT
        tDog.dog_id,
        tDog.user_id,
        tService.service_status
    FROM dogs as tDog
    LEFT JOIN mServiceStatuses as tService on tDog.user_id = tService.user_id
);
