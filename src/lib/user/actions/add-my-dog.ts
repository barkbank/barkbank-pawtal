import { Err, Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { DogSpec } from "@/lib/data/db-models";
import { dbInsertDog, dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { CODE } from "@/lib/utilities/bark-code";

export async function addMyDog(
  actor: UserActor,
  dogProfile: DogProfile,
): Promise<
  Result<
    {
      dogId: string;
    },
    typeof CODE.FAILED
  >
> {
  const { userId, dbPool, dogMapper } = actor.getParams();
  const { dogName, dogPreferredVetId, ...otherFields } = dogProfile;
  const { dogEncryptedOii } = await dogMapper.mapDogOiiToDogSecureOii({
    dogName,
  });
  const dogSpec: DogSpec = { dogEncryptedOii, ...otherFields };
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const { dogId } = await dbInsertDog(dbPool, userId, dogSpec);
    if (dogPreferredVetId !== "") {
      await dbInsertDogVetPreference(conn, dogId, dogPreferredVetId);
    }
    await dbCommit(conn);
    return Ok({ dogId });
  } catch {
    return Err(CODE.FAILED);
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}
