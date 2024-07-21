import { BarkContext } from "@/lib/bark/bark-context";
import { AdminActor } from "../admin-actor";
import { COMMANDS, CommandName } from "./command-index";

export class AdminCommandDispatcher {
  constructor(private config: { context: BarkContext; actor: AdminActor }) {}

  dispatch(args: {
    commandName: CommandName;
    request: string;
  }): Promise<string> {
    const { commandName, request } = args;
    const cmd = COMMANDS[commandName];
    if (cmd === undefined) {
      throw new Error(`Unknown command: ${commandName}`);
    }
    const { context, actor } = this.config;
    return cmd.run({ context, actor, request });
  }
}
