import { insertDog, insertUser, insertVet } from "../_fixtures";
import { ServiceTestContext } from "./_service";

export async function givenUser(
  context: ServiceTestContext,
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
  context: ServiceTestContext,
  options?: {
    dogIdx?: number;
    userId?: string;
  },
): Promise<{
  dogId: string;
  ownerUserId: string;
}> {
  const { dbPool } = context;
  const args = options ?? {};
  const { dogIdx } = args;
  const idx = dogIdx ?? 1;
  const ownerUserId = await (async () => {
    if (args.userId !== undefined) {
      return args.userId;
    }
    const res = await givenUser(context, { userIdx: idx });
    return res.userId;
  })();
  const { dogId } = await insertDog(idx, ownerUserId, dbPool);
  return { dogId, ownerUserId };
}

export async function givenVet(
  context: ServiceTestContext,
): Promise<{ vetId: string }> {
  const { dbPool } = context;
  const { vetId } = await insertVet(1, dbPool);
  return { vetId };
}
