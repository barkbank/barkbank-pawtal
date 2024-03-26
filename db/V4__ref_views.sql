CREATE VIEW latest_values AS (
    WITH
    mLatestVisitTimes as (
        SELECT
            dog_id,
            MAX(visit_time) as latest_visit_time
        FROM reports
        GROUP BY dog_id
    ),
    mLatestReports as (
        SELECT
            tReport.*
        FROM mLatestVisitTimes as tLatest
        LEFT JOIN reports as tReport on (
            tLatest.dog_id = tReport.dog_id
            AND tLatest.latest_visit_time = tReport.visit_time
        )
    )

    SELECT
        tDog.dog_id,
        tUser.user_id,
        tUser.user_residency as latest_user_residency,
        CASE
            WHEN tLatestReport.dog_weight_kg IS NOT NULL THEN tLatestReport.dog_weight_kg
            ELSE tDog.dog_weight_kg
        END as latest_dog_weight_kg
    FROM dogs as tDog
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
    LEFT JOIN mLatestReports as tLatestReport on tDog.dog_id = tLatestReport.dog_id
);
