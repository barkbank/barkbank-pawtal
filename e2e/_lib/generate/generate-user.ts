import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { pickOne } from "./gen-utils";
import { FIRST_NAMES, LAST_NAMES } from "./name-lists";

export function generateUser(): {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
} {
  const guid = generateRandomGUID(4);
  const firstName = pickOne(FIRST_NAMES);
  const lastName = pickOne(LAST_NAMES);
  const userName = `${firstName} ${lastName} (${guid})`;
  const userEmail = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${guid}@uitest.com`;
  const userPhoneNumber = `${50000000 + Math.floor(Math.random() * 10000000)}`;
  return { userName, userEmail, userPhoneNumber };
}
