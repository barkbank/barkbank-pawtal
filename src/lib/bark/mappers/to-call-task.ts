import { BarkContext } from "../bark-context";
import { CallTask, CallTaskSchema } from "../models/call-task";
import { EncryptedCallTask } from "../models/encrypted-call-task";
import { toDogName } from "./to-dog-name";
import { toOwnerName } from "./to-owner-name";

export async function toCallTask(
  context: BarkContext,
  encryptedCallTask: EncryptedCallTask,
): Promise<CallTask> {
  const { dogEncryptedOii, userEncryptedPii, ...fields } = encryptedCallTask;
  const dogName = await toDogName(context, dogEncryptedOii);
  const ownerName = await toOwnerName(context, userEncryptedPii);
  const callTask: CallTask = { dogName, ownerName, ...fields };
  return CallTaskSchema.parse(callTask);
}
