import { Pool } from "pg";
import { DOG_STATUS } from "../models/bark-models";
import { DogMapper } from "../data/dog-mapper";
import { dbQuery } from "../data/db-utils";
import { MyDog } from "../models/user-models";

export async function handleUserGetMyPets(args: {
  userId: string;
  dbPool: Pool;
  dogMapper: DogMapper;
}): Promise<MyDog[]> {
  const { userId, dbPool, dogMapper } = args;
  const sql = `
  SELECT
    dog_id as "dogId",
    dog_encrypted_oii as "dogEncryptedOii",
    CASE
      WHEN dog_ever_pregnant = 'YES' THEN $5
      WHEN dog_ever_received_transfusion = 'YES' THEN $5
      WHEN dog_breed = '' AND dog_weight_kg IS NULL THEN $2
      WHEN dog_weight_kg < 20 THEN $4
      ELSE $3
    END as "dogStatus"
  FROM dogs
  WHERE user_id = $1
  `;
  const res = await dbQuery(dbPool, sql, [
    userId,
    DOG_STATUS.INCOMPLETE,
    DOG_STATUS.ELIGIBLE,
    DOG_STATUS.INELIGIBLE,
    DOG_STATUS.PERMANENTLY_INELIGIBLE,
  ]);
  const dogs = await Promise.all(
    res.rows.map(async (row) => {
      const { dogId, dogStatus } = row;
      const secureOii = dogMapper.toDogSecureOii(row);
      const oii = await dogMapper.mapDogSecureOiiToDogOii(secureOii);
      return {
        dogId,
        dogName: oii.dogName,
        dogStatus,
      } as MyDog;
    }),
  );
  return dogs;
}
