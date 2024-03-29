import { Pool } from "pg";
import { DOG_STATUS } from "../data/db-enums";
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
    tDog.dog_id as "dogId",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tStatus.profile_status as "dogProfileStatus",
    tStatus.medical_status as "dogMedicalStatus"
  FROM dogs as tDog
  LEFT JOIN dog_statuses as tStatus on tDog.dog_id = tStatus.dog_id
  WHERE tDog.user_id = $1
  `;
  const res = await dbQuery(dbPool, sql, [userId]);
  const dogs = await Promise.all(
    res.rows.map(async (row) => {
      const { dogId, dogProfileStatus, dogMedicalStatus } = row;
      const secureOii = dogMapper.toDogSecureOii(row);
      const { dogName } = await dogMapper.mapDogSecureOiiToDogOii(secureOii);
      const myDog: MyDog = {
        dogId,
        dogName,
        dogProfileStatus,
        dogMedicalStatus,
        appointment: null,
      };
      return myDog;
    }),
  );
  return dogs;
}
