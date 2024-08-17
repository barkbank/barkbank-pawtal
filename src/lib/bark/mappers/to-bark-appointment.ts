import { BarkContext } from "../bark-context";
import { EncryptedBarkAppointment } from "../models/encrypted-bark-appointment";
import { BarkAppointment } from "../models/bark-appointment";
import { toDogOii } from "./to-dog-oii";
import { toUserPii } from "./user-mappers";

// TODO: Use schemas to parse inputs and outputs, this and the other mapper functions
export async function toBarkAppointment(
  context: BarkContext,
  encrypted: EncryptedBarkAppointment,
): Promise<BarkAppointment> {
  const { userEncryptedPii, dogEncryptedOii, ...otherFields } = encrypted;
  const { userName } = await toUserPii(context, userEncryptedPii);
  const { dogName } = await toDogOii(context, dogEncryptedOii);
  return { ...otherFields, ownerName: userName, dogName };
}
