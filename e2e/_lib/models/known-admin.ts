import { z } from "zod";

export const KnownAdminSchema = z.object({
  adminEmail: z.string(),
  adminName: z.string(),
  adminPhoneNumber: z.string(),
});

export type KnownAdmin = z.infer<typeof KnownAdminSchema>;
