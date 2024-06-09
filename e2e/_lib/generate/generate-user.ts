import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { pickOne } from "./gen-utils";
import { FIRST_NAMES, LAST_NAMES } from "./name-lists";
import { z } from "zod";

export const GenerateUserSchema = z.object({
  userName: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
});

export type GenerateUserType = z.infer<typeof GenerateUserSchema>;

export function generateUser(): GenerateUserType {
  const guid = generateRandomGUID(4);
  const firstName = pickOne(FIRST_NAMES);
  const lastName = pickOne(LAST_NAMES);
  const userName = `${firstName} ${lastName} (${guid})`;
  const userEmail = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${guid}@uitest.com`;
  const userPhoneNumber = `${50000000 + Math.floor(Math.random() * 10000000)}`;
  const result: GenerateUserType = { userName, userEmail, userPhoneNumber };
  console.log("Generated User", result);
  return GenerateUserSchema.parse(result);
}
