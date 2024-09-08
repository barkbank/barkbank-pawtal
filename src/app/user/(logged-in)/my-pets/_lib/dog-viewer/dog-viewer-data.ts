import { BarkReportSchema } from "@/lib/bark/models/bark-report";
import { DogAppointmentSchema } from "@/lib/bark/models/dog-appointment";
import { DogPreferredVetSchema } from "@/lib/bark/models/dog-preferred-vet";
import { DogProfileSpecSchema } from "@/lib/bark/models/dog-profile-models";
import { DogStatusesSchema } from "@/lib/bark/models/dog-statuses";
import { z } from "zod";

export const DogViewerDataSchema = z.object({
  dogId: z.string(),
  dogProfile: DogProfileSpecSchema,
  dogStatuses: DogStatusesSchema,
  dogAppointments: z.array(DogAppointmentSchema),
  dogPreferredVet: DogPreferredVetSchema.nullable(),
  dogReports: z.array(BarkReportSchema),
});

export type DogViewerData = z.infer<typeof DogViewerDataSchema>;
