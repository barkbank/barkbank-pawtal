import { BarkContext } from "@/lib/bark/bark-context";
import { AdminActor } from "../admin-actor";

export class AdminCommandDispatcher {
  constructor(
    private context: BarkContext,
    private actor: AdminActor,
  ) {}

  dispatch(commandName: string, request: string): Promise<string> {
    throw new Error(`Unknown command: ${commandName}`);
  }
}
