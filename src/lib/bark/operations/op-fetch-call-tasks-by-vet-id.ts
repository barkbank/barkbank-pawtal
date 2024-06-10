import { Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CallTask } from "../models/call-task";
import { CODE } from "@/lib/utilities/bark-code";

// WIP: Define CallTask in bark models.
export async function opFetchCallTasksByVetId(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ callTasks: CallTask[] }, typeof CODE.FAILED>> {
  const callTasks: CallTask[] = [];
  return Ok({ callTasks });
}
