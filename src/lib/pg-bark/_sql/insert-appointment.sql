-- WIP: remove this sql
-- (dogId, vetId)

INSERT INTO calls (dog_id, vet_id, call_outcome, encrypted_opt_out_reason)
VALUES ($1, $2, 'APPOINTMENT', '')
RETURNING call_id::text as "appointmentId"
