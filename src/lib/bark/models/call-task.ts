import { z } from "zod";
import { DogGenderSchema } from "../enums/dog-gender";
import { YesNoSchema } from "../enums/yes-no";

export const CallTaskSchema = z.object({
  dogId: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: DogGenderSchema,
  dogWeightKg: z.number().nullable(),
  dogEverReceivedTransfusion: YesNoSchema,
  dogEverPregnant: YesNoSchema,
  ownerName: z.string(),
  dogLastContactedTime: z.date().nullable(),
  ownerLastContactedTime: z.date().nullable(),
});

export type CallTask = z.infer<typeof CallTaskSchema>;
