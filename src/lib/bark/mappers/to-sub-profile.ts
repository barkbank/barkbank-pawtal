import { DogProfile } from "../models/dog-profile-models";
import { SubProfile, SubProfileSchema } from "../models/sub-profile";

export function toSubProfile(dogProfile: DogProfile): SubProfile {
  const {
    dogName,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogPreferredVetId,
  } = dogProfile;
  return SubProfileSchema.parse({
    dogName,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogPreferredVetId,
  });
}
