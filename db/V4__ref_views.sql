CREATE VIEW latest_values AS (
    SELECT
        tDog.dog_id,
        tUser.user_id,
        tUser.user_residency as latest_user_residency
    FROM dogs as tDog
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
);
