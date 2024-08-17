import { AdminCommand, AdminCommandArgs } from "../admin-command";

export class ListVetAccountsByVet implements AdminCommand {
  async run(args: AdminCommandArgs): Promise<string> {
    const { actor, request } = args;
    const obj = JSON.parse(request);
    const { vetId } = obj;
    const { result, error } = await actor.getVetAccountsByVetId({ vetId });
    if (error !== undefined) {
      throw new Error(error);
    }
    const { accounts } = result;
    return JSON.stringify({ accounts });
  }

  getExampleRequest(): string {
    return JSON.stringify({ vetId: "123" });
  }
}
