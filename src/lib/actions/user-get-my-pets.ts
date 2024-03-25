"use server";

import APP from "@/lib/app";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { MyDog } from "../models/user-models";
import { Err, Ok, Result } from "../result";
import { ERR_401_NO_ACTOR, ERR_500_SERVER_ERROR } from "./action-errors";
import { handleUserGetMyPets } from "../handlers/handle-user-get-my-pets";

// TODO: Re-evaluate if this is needed after /user/my-pets is implemented.
export async function userGetMyPets(): Promise<
  Result<MyDog[], typeof ERR_401_NO_ACTOR | typeof ERR_500_SERVER_ERROR>
> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return Err(ERR_401_NO_ACTOR);
  }
  try {
    const myDogs = await handleUserGetMyPets({
      userId: actor.getUserId(),
      dbPool: await APP.getDbPool(),
      dogMapper: await APP.getDogMapper(),
    });
    return Ok(myDogs);
  } catch {
    return Err(ERR_500_SERVER_ERROR);
  }
}
