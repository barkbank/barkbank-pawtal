import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { insertDog, insertUser, insertVet } from "../_fixtures";
import { BarkTestContext } from "./_service";

export async function givenUser(
  context: BarkTestContext,
  options?: { userIdx?: number },
): Promise<{ userId: string }> {
  const { dbPool } = context;
  const args = options ?? {};
  const { userIdx } = args;
  const idx = userIdx ?? 1;
  const { userId } = await insertUser(idx, dbPool);
  return { userId };
}

export async function givenDog(
  context: BarkTestContext,
  options?: {
    dogIdx?: number;
    userId?: string;
    preferredVetId?: string;
  },
): Promise<{
  dogId: string;
  ownerUserId: string;
}> {
  const { dbPool } = context;
  const args = options ?? {};
  const { dogIdx, preferredVetId } = args;
  const idx = dogIdx ?? 1;
  const ownerUserId = await (async () => {
    if (args.userId !== undefined) {
      return args.userId;
    }
    const res = await givenUser(context, { userIdx: idx });
    return res.userId;
  })();
  const { dogId } = await insertDog(idx, ownerUserId, dbPool);
  if (preferredVetId !== undefined) {
    await dbInsertDogVetPreference(dbPool, dogId, preferredVetId);
  }
  return { dogId, ownerUserId };
}

export async function givenVet(
  context: BarkTestContext,
): Promise<{ vetId: string }> {
  const { dbPool } = context;
  const { vetId } = await insertVet(1, dbPool);
  return { vetId };
}
