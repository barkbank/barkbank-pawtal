import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CallTask } from "../models/call-task";
import { CODE } from "@/lib/utilities/bark-code";
import { selectCallTasksByVetId } from "../queries/select-call-tasks-by-vet-id";
import { toCallTask } from "../mappers/to-call-task";

export async function opFetchCallTasksByVetId(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ callTasks: CallTask[] }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { vetId } = args;
  try {
    const encryptedCallTasks = await selectCallTasksByVetId(dbPool, { vetId });
    const futureTasks = encryptedCallTasks.map((task) =>
      toCallTask(context, task),
    );
    const callTasks = await Promise.all(futureTasks);
    return Ok({ callTasks });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
