import { z } from "zod";
import { SpecifiedDogGenderSchema } from "../enums/dog-gender";
import { YesNoSchema } from "../enums/yes-no";

export const CallTaskSchema = z.object({
  dogId: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: SpecifiedDogGenderSchema,
  dogWeightKg: z.number().nullable(),
  dogEverReceivedTransfusion: YesNoSchema,
  dogEverPregnant: YesNoSchema,
  ownerName: z.string(),
});

export type CallTask = z.infer<typeof CallTaskSchema>
