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
    mProfileStatuses as (
        SELECT
            tDog.dog_id,
            CASE
                WHEN tDog.dog_ever_pregnant <> 'UNKNOWN'::t_yes_no_unknown
                AND tDog.dog_ever_received_transfusion <> 'UNKNOWN'::t_yes_no_unknown
                AND (
                    tDog.dog_breed <> ''
                    OR tLatest.latest_dog_weight_kg IS NOT NULL
                )
                THEN 'COMPLETE'::t_profile_status
                ELSE 'INCOMPLETE'::t_profile_status
            END as profile_status
        FROM dogs as tDog
        LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
    ),
    mMedicalStatuses as (
        SELECT
            tDog.dog_id,
            CASE
                WHEN tDog.dog_ever_pregnant = 'YES' THEN 'PERMANENTLY_INELIGIBLE'::t_medical_status
                WHEN tDog.dog_ever_received_transfusion = 'YES' THEN 'PERMANENTLY_INELIGIBLE'::t_medical_status
                ELSE 'ELIGIBLE'::t_medical_status
            END as medical_status
        FROM dogs as tDog
        LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
    )

    SELECT
        tDog.dog_id,
        tDog.user_id,
        tService.service_status,
        tProfile.profile_status,
        tMedical.medical_status
    FROM dogs as tDog
    LEFT JOIN mServiceStatuses as tService on tDog.user_id = tService.user_id
    LEFT JOIN mProfileStatuses as tProfile on tDog.dog_id = tProfile.dog_id
    LEFT JOIN mMedicalStatuses as tMedical on tDog.dog_id = tMedical.dog_id
);
