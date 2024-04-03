import { UserActor } from "../user-actor";
import { MyDogRegistrationUpdate } from "../user-models";

type Result = "OK_UPDATED" | "ERROR_REPORT_EXISTS";

export async function updateMyDogRegistration(
  actor: UserActor,
  update: MyDogRegistrationUpdate,
): Promise<Result> {
  return "OK_UPDATED";
}
