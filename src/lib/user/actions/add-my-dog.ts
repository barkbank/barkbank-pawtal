import { Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { MyDogRegistration } from "../user-models";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { DogSpec } from "@/lib/data/db-models";
import { dbInsertDog, dbInsertDogVetPreference } from "@/lib/data/db-dogs";

type AddDogResult = {
  dogId: string;
};

type AddDogError = "FAILED";

export async function addMyDog(
  actor: UserActor,
  registration: MyDogRegistration,
): Promise<Result<AddDogResult, AddDogError>> {
  const { userId, dbPool, dogMapper } = actor.getParams();
  const { dogName, dogPreferredVetId, ...otherFields } = registration;
  const { dogEncryptedOii } = await dogMapper.mapDogOiiToDogSecureOii({
    dogName,
  });
  const dogSpec: DogSpec = { dogEncryptedOii, ...otherFields };
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const { dogId } = await dbInsertDog(dbPool, userId, dogSpec);
    if (dogPreferredVetId !== null) {
      await dbInsertDogVetPreference(conn, dogId, dogPreferredVetId);
    }
    await dbCommit(conn);
    return Ok({ dogId });
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}
