import { Err, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { MyDogRegistration } from "../user-models";

type AddDogResult = {
  dogId: string;
};

type AddDogError = "FAILED";

export async function addMyDog(
  actor: UserActor,
  registration: MyDogRegistration,
): Promise<Result<AddDogResult, AddDogError>> {
  return Err("FAILED");
}
