import { z } from "zod";
import { MedicalStatusSchema } from "../enums/medical-status";
import { ParticipationStatusSchema } from "../enums/participation-status";
import { ProfileStatusSchema } from "../enums/profile-status";
import { ServiceStatusSchema } from "../enums/service-status";

/**
 * The different statuses of a dog.
 */
export const DogStatusesSchema = z.object({
  dogServiceStatus: ServiceStatusSchema,
  dogProfileStatus: ProfileStatusSchema,
  dogMedicalStatus: MedicalStatusSchema,
  dogParticipationStatus: ParticipationStatusSchema,
  numPendingReports: z.number(),
});

export type DogStatuses = z.infer<typeof DogStatusesSchema>;
