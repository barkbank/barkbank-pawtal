import { DogProfileSpec } from "../models/dog-profile-models";
import {
  SubProfileSpec,
  SubProfileSpecSchema,
} from "../models/dog-profile-models";

export function toSubProfile(dogProfile: DogProfileSpec): SubProfileSpec {
  const {
    dogName,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogPreferredVetId,
  } = dogProfile;
  return SubProfileSpecSchema.parse({
    dogName,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogPreferredVetId,
  });
}
