CREATE VIEW latest_values AS (
    SELECT
        tDog.dog_id,
        tUser.user_id,
        tUser.user_residency as latest_user_residency,
        tDog.dog_weight_kg as latest_dog_weight_kg
    FROM dogs as tDog
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
);
