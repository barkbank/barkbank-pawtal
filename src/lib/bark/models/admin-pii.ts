import { z } from "zod";

export const AdminPiiSchema = z.object({
  adminEmail: z.string().email(),
  adminName: z.string(),
  adminPhoneNumber: z.string(),
});

export type AdminPii = z.infer<typeof AdminPiiSchema>;
