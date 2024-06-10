import { z } from "zod";
import { SpecifiedDogGenderSchema } from "../enums/dog-gender";

export const CallTaskSchema = z.object({
  dogId: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: SpecifiedDogGenderSchema,
  dogWeightKg: z.number().optional(),
  // WIP: dogEverReceivedTransfusion
  // WIP: dogEverPregnant
  // WIP: ownerName
});

// export type xAvailableDog = {
//   dogId: string;
//   dogName: string;
//   dogBreed: string;
//   dogBirthday: Date;
//   dogGender: DogGender;
//   dogWeightKg: number | null;
//   dogEverReceivedTransfusion: YesNoUnknown;
//   dogEverPregnant: YesNoUnknown;
// };
