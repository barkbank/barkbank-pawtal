import { z } from "zod";
import { YesNoUnknownSchema } from "../enums/yes-no-unknown";
import { PosNegNilSchema } from "../enums/pos-neg-nil";
import { ReportedIneligibilitySchema } from "../enums/reported-ineligibility";

export const IneligibilityFactorsSchema = z.object({
  // From dogs
  dogBirthday: z.date(),
  dogEverPregnant: YesNoUnknownSchema,
  dogEverReceivedTransfusion: YesNoUnknownSchema,

  // From latest_values
  latestDogWeightKg: z.number().nullable(),
  latestDogHeartwormResult: PosNegNilSchema,
  latestDogHeartwormObservationTime: z.date().nullable(),
  latestDogReportedIneligibility: ReportedIneligibilitySchema,
  latestDogReportedIneligibilityExpiryTime: z.date().nullable(),
  latestDonationTime: z.date().nullable(),
});

export type IneligibilityFactors = z.infer<typeof IneligibilityFactorsSchema>;
