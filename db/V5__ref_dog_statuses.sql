CREATE VIEW dog_statuses
WITH (security_invoker=on)
AS (
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
                WHEN tLatest.latest_dog_age_months >= 12 * 8 THEN 'PERMANENTLY_INELIGIBLE'::t_medical_status
                WHEN EXISTS (
                    SELECT 1
                    FROM reports
                    WHERE dog_id = tDog.dog_id
                    AND dog_reported_ineligibility = 'PERMANENTLY_INELIGIBLE'::t_reported_ineligibility
                ) THEN 'PERMANENTLY_INELIGIBLE'::t_medical_status
                WHEN tDog.dog_ever_pregnant = 'UNKNOWN' THEN 'UNKNOWN'::t_medical_status
                WHEN tDog.dog_ever_received_transfusion = 'UNKNOWN' THEN 'UNKNOWN'::t_medical_status
                WHEN (
                    tDog.dog_breed = '' AND tLatest.latest_dog_weight_kg IS NULL
                ) THEN 'UNKNOWN'::t_medical_status
                WHEN tLatest.latest_dog_weight_kg < 20.0 THEN 'TEMPORARILY_INELIGIBLE'::t_medical_status
                WHEN tLatest.latest_dog_age_months < 12 THEN 'TEMPORARILY_INELIGIBLE'::t_medical_status
                WHEN (
                    tLatest.latest_dog_heartworm_result = 'POSITIVE'
                    AND tLatest.latest_dog_heartworm_observation_time IS NOT NULL
                    AND (
                        CURRENT_TIMESTAMP - tLatest.latest_dog_heartworm_observation_time
                    ) < INTERVAL '6 months'
                ) THEN 'TEMPORARILY_INELIGIBLE'::t_medical_status
                WHEN (
                    tLatest.latest_blood_donation_time IS NOT NULL
                    AND (
                        CURRENT_TIMESTAMP - tLatest.latest_blood_donation_time
                    ) < INTERVAL '3 months'
                ) THEN 'TEMPORARILY_INELIGIBLE'::t_medical_status
                WHEN (
                    tLatest.latest_dog_reported_ineligibility = 'TEMPORARILY_INELIGIBLE'
                    AND CURRENT_TIMESTAMP < tLatest.latest_ineligibility_expiry_time
                ) THEN 'TEMPORARILY_INELIGIBLE'::t_medical_status
                ELSE 'ELIGIBLE'::t_medical_status
            END as medical_status
        FROM dogs as tDog
        LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
    ),
    mParticipationStatuses as (
        SELECT
            dog_id,
            CASE
                WHEN dog_participation_status <> 'PAUSED' THEN dog_participation_status
                WHEN dog_pause_expiry_time IS NULL THEN 'PARTICIPATING'::t_participation_status
                WHEN CURRENT_TIMESTAMP < dog_pause_expiry_time THEN 'PAUSED'::t_participation_status
                ELSE 'PARTICIPATING'::t_participation_status
            END as participation_status,
            CASE
                WHEN dog_participation_status <> 'PAUSED' THEN NULL
                WHEN dog_pause_expiry_time IS NULL THEN NULL
                WHEN CURRENT_TIMESTAMP < dog_pause_expiry_time THEN dog_pause_expiry_time
                ELSE NULL
            END as participation_pause_expiry_time
        FROM dogs
    )

    SELECT
        tDog.dog_id,
        tDog.user_id,
        tService.service_status,
        tProfile.profile_status,
        tMedical.medical_status,
        tParticipation.participation_status,
        tParticipation.participation_pause_expiry_time
    FROM dogs as tDog
    LEFT JOIN mServiceStatuses as tService on tDog.user_id = tService.user_id
    LEFT JOIN mProfileStatuses as tProfile on tDog.dog_id = tProfile.dog_id
    LEFT JOIN mMedicalStatuses as tMedical on tDog.dog_id = tMedical.dog_id
    LEFT JOIN mParticipationStatuses as tParticipation on tDog.dog_id = tParticipation.dog_id
);
