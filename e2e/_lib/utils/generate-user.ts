import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { pickOne } from "./pick-one";
import { FIRST_NAMES, LAST_NAMES } from "../data/name-lists";
import { GeneratedUser, GeneratedUserSchema } from "../models/generated-user";
import { USER_TITLE } from "@/lib/bark/enums/user-title";

export function generateUser(): GeneratedUser {
  const guid = generateRandomGUID(4);
  const userTitle = pickOne([USER_TITLE.MR, USER_TITLE.MS]);
  const firstName = pickOne(FIRST_NAMES);
  const lastName = pickOne(LAST_NAMES);
  const userName = `${firstName} ${lastName} (${guid})`;
  const userEmail = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${guid}@uitest.com`;
  const userPhoneNumber = `${50000000 + Math.floor(Math.random() * 10000000)}`;
  const result: GeneratedUser = {
    userTitle,
    userName,
    userEmail,
    userPhoneNumber,
  };
  console.log("Generated User", result);
  return GeneratedUserSchema.parse(result);
}
