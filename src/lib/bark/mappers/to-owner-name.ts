import { BarkContext } from "../bark-context";
import { toUserPii } from "./to-user-pii";

export async function toOwnerName(
  context: BarkContext,
  userEncryptedPii: string,
): Promise<string> {
  const { userName } = await toUserPii(context, userEncryptedPii);
  return userName;
}
