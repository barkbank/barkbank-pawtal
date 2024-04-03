import { UserActor } from "../user-actor";
import { MyDogDetailsUpdate } from "../user-models";

type Response =
  | "OK_UPDATED"
  | "ERROR_REPORT_EXISTS"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_MISSING_DOG"
  | "FAILURE_DB_UPDATE";

export async function updateMyDogDetails(actor: UserActor, update: MyDogDetailsUpdate): Promise<Response> {
  return "OK_UPDATED";
}
