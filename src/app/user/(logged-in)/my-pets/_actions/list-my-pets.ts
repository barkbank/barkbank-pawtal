"use server";

import APP from "@/lib/app";
import { getAuthenticatedUserActor } from "@/lib/auth";
import {
  ListMyPetsHandler,
  ListMyPetsResponse,
} from "@/lib/user/list-my-pets-handler";

/**
 * @returns ListMyPetsResponse if logged in, null if not logged in.
 */
export async function listMyPets(): Promise<ListMyPetsResponse | null> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return null;
  }
  const handler = new ListMyPetsHandler({
    dbPool: await APP.getDbPool(),
    dogMapper: await APP.getDogMapper(),
  });
  return handler.handle(actor);
}
