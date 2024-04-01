import { UserActor } from "../user-actor";
import { MyDogDetails } from "../user-models";

export async function getMyDogDetails(
  actor: UserActor,
  dogId: string,
): Promise<MyDogDetails | null> {
  return null;
}
