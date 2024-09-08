import { DogProfileSpec } from "../models/dog-profile-models";
import { SubProfile, SubProfileSchema } from "../models/dog-profile-models";

export function toSubProfile(dogProfile: DogProfileSpec): SubProfile {
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
