import { BarkContext } from "../bark-context";
import { DogProfile } from "../models/dog-profile";
import { EncryptedDogProfile } from "../models/dog-profile";
import { toDogName } from "./to-dog-name";

export async function toDogProfile(
  context: BarkContext,
  encrypted: EncryptedDogProfile,
): Promise<DogProfile> {
  const { dogEncryptedOii, ...fields } = encrypted;
  const dogName = await toDogName(context, dogEncryptedOii);
  return { dogName, ...fields };
}
