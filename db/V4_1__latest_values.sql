CREATE VIEW latest_values AS (
    WITH
    mLatestReports as (
        SELECT tReport.*
        FROM (
            SELECT
                dog_id,
                MAX(visit_time) as latest_visit_time
            FROM reports
            GROUP BY dog_id
        ) as tLatest
        LEFT JOIN reports as tReport on (
            tLatest.dog_id = tReport.dog_id
            AND tLatest.latest_visit_time = tReport.visit_time
        )
    ),
    mLatestHeartwormReports as (
        SELECT
            tReport.dog_id,
            tReport.dog_heartworm
        FROM (
            SELECT
                dog_id,
                MAX(visit_time) as latest_visit_time
            FROM reports
            WHERE dog_heartworm <> 'NIL'
            GROUP BY dog_id
        ) as tLatest
        LEFT JOIN reports as tReport on (
            tLatest.dog_id = tReport.dog_id
            AND tLatest.latest_visit_time = tReport.visit_time
        )
    )

    SELECT
        tDog.dog_id,
        tUser.user_id,
        tUser.user_residency as latest_user_residency,
        COALESCE(tLatest.dog_weight_kg, tDog.dog_weight_kg) as latest_dog_weight_kg,
        tLatest.dog_body_conditioning_score as latest_dog_body_conditioning_score,
        COALESCE(tHeartworm.dog_heartworm, 'NIL') as latest_dog_heartworm
    FROM dogs as tDog
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
    LEFT JOIN mLatestReports as tLatest on tDog.dog_id = tLatest.dog_id
    LEFT JOIN mLatestHeartwormReports as tHeartworm on tDog.dog_id = tHeartworm.dog_id
);
