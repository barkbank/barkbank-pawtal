import { BarkContext } from "../bark-context";
import { DogProfile } from "../models/dog-profile-models";
import { EncryptedDogProfile } from "../models/encrypted-dog-profile";
import { toDogName } from "./to-dog-name";

export async function toDogProfile(
  context: BarkContext,
  encrypted: EncryptedDogProfile,
): Promise<DogProfile> {
  const { dogEncryptedOii, ...fields } = encrypted;
  const dogName = await toDogName(context, dogEncryptedOii);
  return { dogName, ...fields };
}
