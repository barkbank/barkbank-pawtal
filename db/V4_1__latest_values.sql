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
    ),
    mLatestDea1Point1 as (
        SELECT
            tReport.dog_id,
            tReport.dog_dea1_point1
        FROM (
            SELECT
                dog_id,
                MAX(visit_time) as latest_visit_time
            FROM reports
            WHERE dog_dea1_point1 <> 'NIL'
            GROUP BY dog_id
        ) as tLatest
        LEFT JOIN reports as tReport on (
            tLatest.dog_id = tReport.dog_id
            AND tLatest.latest_visit_time = tReport.visit_time
        )
    ),
    mAgeCalculations as (
        WITH
        mDateParts as (
            SELECT
                dog_id,
                EXTRACT(YEAR FROM dog_birthday) as b_year,
                EXTRACT(MONTH FROM dog_birthday) as b_month,
                EXTRACT(DAY FROM dog_birthday) as b_day,
                EXTRACT(YEAR FROM CURRENT_TIMESTAMP) as c_year,
                EXTRACT(MONTH FROM CURRENT_TIMESTAMP) as c_month,
                EXTRACT(DAY FROM CURRENT_TIMESTAMP) as c_day
            FROM dogs
        )

        -- b_ is birthday and c_ is current.
        SELECT
            dog_id,
            CASE
                WHEN c_month < b_month THEN c_year - b_year - 1
                WHEN c_month > b_month THEN c_year - b_year
                WHEN c_day < b_day THEN c_year - b_year - 1
                ELSE c_year - b_year
            END as latest_dog_age_years
        FROM mDateParts
    )

    SELECT
        tDog.dog_id,
        tUser.user_id,
        -- WIP: latest_user_residency may not be necessary.
        tUser.user_residency as latest_user_residency,
        COALESCE(tLatest.dog_weight_kg, tDog.dog_weight_kg) as latest_dog_weight_kg,
        tLatest.dog_body_conditioning_score as latest_dog_body_conditioning_score,
        COALESCE(tHeartworm.dog_heartworm, 'NIL') as latest_dog_heartworm,
        CASE
            WHEN tDea1Point1.dog_dea1_point1 IS NOT NULL THEN tDea1Point1.dog_dea1_point1
            WHEN tDog.dog_dea1_point1 = 'POSITIVE' THEN 'POSITIVE'::t_pos_neg_nil
            WHEN tDog.dog_dea1_point1 = 'NEGATIVE' THEN 'NEGATIVE'::t_pos_neg_nil
            ELSE 'NIL'::t_pos_neg_nil
        END as latest_dog_dea1_point1,
        tAge.latest_dog_age_years::integer
    FROM dogs as tDog
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
    LEFT JOIN mLatestReports as tLatest on tDog.dog_id = tLatest.dog_id
    LEFT JOIN mLatestHeartwormReports as tHeartworm on tDog.dog_id = tHeartworm.dog_id
    LEFT JOIN mLatestDea1Point1 as tDea1Point1 on tDog.dog_id = tDea1Point1.dog_id
    LEFT JOIN mAgeCalculations as tAge on tDog.dog_id = tAge.dog_id
);
