CREATE VIEW latest_values AS (
    WITH
    mLatestReports as (
        SELECT
            tReport.dog_id,
            tReport.dog_weight_kg,
            tReport.dog_body_conditioning_score,
            tReport.dog_reported_ineligibility,
            tReport.ineligibility_expiry_time,
            tReport.visit_time
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
            tReport.dog_heartworm as latest_dog_heartworm_result,
            CASE
                WHEN tReport.dog_heartworm = 'POSITIVE'
                THEN tReport.visit_time
                ELSE NULL
            END as latest_dog_heartworm_observation_time
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
    mLatestBloodDonationTimes as (
        SELECT
            dog_id,
            MAX(visit_time) as latest_blood_donation_time
        FROM reports
        WHERE dog_did_donate_blood = TRUE
        GROUP BY dog_id
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
            (
                CASE
                    WHEN c_day < b_day THEN (
                        (c_year - b_year) * 12 + (c_month - b_month) - 1
                    )
                    ELSE (
                        (c_year - b_year) * 12 + (c_month - b_month)
                    )
                END
            )::integer as latest_dog_age_months
        FROM mDateParts
    )

    SELECT
        tDog.dog_id,
        tUser.user_id,
        CASE
            WHEN tReport.visit_time IS NULL THEN tDog.dog_weight_kg
            WHEN tReport.visit_time > tDog.profile_modification_time THEN tReport.dog_weight_kg
            ELSE tDog.dog_weight_kg
        END as latest_dog_weight_kg,
        tReport.dog_body_conditioning_score as latest_dog_body_conditioning_score,
        COALESCE(tHeartworm.latest_dog_heartworm_result, 'NIL') as latest_dog_heartworm_result,
        tHeartworm.latest_dog_heartworm_observation_time,
        tReport.dog_reported_ineligibility as latest_dog_reported_ineligibility,
        tReport.ineligibility_expiry_time as latest_ineligibility_expiry_time,
        CASE
            WHEN tDea1Point1.dog_dea1_point1 IS NOT NULL THEN tDea1Point1.dog_dea1_point1
            WHEN tDog.dog_dea1_point1 = 'POSITIVE' THEN 'POSITIVE'::t_pos_neg_nil
            WHEN tDog.dog_dea1_point1 = 'NEGATIVE' THEN 'NEGATIVE'::t_pos_neg_nil
            ELSE 'NIL'::t_pos_neg_nil
        END as latest_dog_dea1_point1,
        tAge.latest_dog_age_months,
        tDonation.latest_blood_donation_time
    FROM dogs as tDog
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
    LEFT JOIN mLatestReports as tReport on tDog.dog_id = tReport.dog_id
    LEFT JOIN mLatestHeartwormReports as tHeartworm on tDog.dog_id = tHeartworm.dog_id
    LEFT JOIN mLatestDea1Point1 as tDea1Point1 on tDog.dog_id = tDea1Point1.dog_id
    LEFT JOIN mAgeCalculations as tAge on tDog.dog_id = tAge.dog_id
    LEFT JOIN mLatestBloodDonationTimes as tDonation on tDog.dog_id = tDonation.dog_id
);
