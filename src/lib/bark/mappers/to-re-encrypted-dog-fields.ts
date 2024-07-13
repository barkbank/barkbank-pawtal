import { BarkContext } from "../bark-context";
import {
  EncryptedDogFields,
  EncryptedDogFieldsSchema,
} from "../models/encrypted-dog-fields";
import { toDogEncryptedOii } from "./to-dog-encrypted-oii";
import { toDogOii } from "./to-dog-oii";

export async function toReEncryptedDogFields(
  context: BarkContext,
  fields: EncryptedDogFields,
): Promise<EncryptedDogFields> {
  const { dogId, dogEncryptedOii } = fields;
  const oii = await toDogOii(context, dogEncryptedOii);
  const reEncryptedOii = await toDogEncryptedOii(context, oii);
  const out: EncryptedDogFields = {
    dogId,
    dogEncryptedOii: reEncryptedOii,
  };
  return EncryptedDogFieldsSchema.parse(out);
}
