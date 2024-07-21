import { opListVetAccountsByVet } from "@/lib/bark/operations/op-list-vet-accounts-by-vet";
import { AdminCommand, AdminCommandArgs } from "../admin-command";

export class ListVetAccountsByVet implements AdminCommand {
  async run(args: AdminCommandArgs): Promise<string> {
    const { context, request } = args;
    const obj = JSON.parse(request);
    const { vetId } = obj;
    const { result, error } = await opListVetAccountsByVet(context, { vetId });
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
