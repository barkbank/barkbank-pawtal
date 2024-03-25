"use server";

import APP from "@/lib/app";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { ListMyPetsHandler } from "@/lib/handlers/list-my-pets-handler";
import { ListMyPetsResponse } from "../models/user-models";
import { Err, Ok, Result } from "../result";
import { ERR_401_NO_ACTOR, ERR_500_SERVER_ERROR } from "./action-errors";

export async function userGetMyPets(): Promise<
  Result<
    ListMyPetsResponse,
    typeof ERR_401_NO_ACTOR | typeof ERR_500_SERVER_ERROR
  >
> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return Err(ERR_401_NO_ACTOR);
  }
  try {
    const handler = new ListMyPetsHandler({
      dbPool: await APP.getDbPool(),
      dogMapper: await APP.getDogMapper(),
    });
    const response = await handler.handle(actor);
    return Ok(response);
  } catch {
    return Err(ERR_500_SERVER_ERROR);
  }
}
