-- (reportId, ...)

UPDATE reports
SET
    visit_time = $2,

    dog_weight_kg = $3,
    dog_body_conditioning_score = $4,
    dog_heartworm = $5,
    dog_dea1_point1 = $6,

    dog_reported_ineligibility = $7,
    encrypted_ineligibility_reason = $8,
    ineligibility_expiry_time = $9,

    dog_did_donate_blood = $10
WHERE report_id = $1
RETURNING report_modification_time as "reportModificationTime"
