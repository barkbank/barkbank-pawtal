import { AdminCommand, AdminCommandArgs } from "../admin-command";
import { opGetVetClinics } from "@/lib/bark/operations/op-get-vet-clinics";

export class ListVetClinics implements AdminCommand {
  getExampleRequest(): string {
    return "";
  }

  async run(args: AdminCommandArgs): Promise<string> {
    const { context } = args;
    const { result, error } = await opGetVetClinics(context);
    if (error) {
      throw new Error(error);
    }
    return JSON.stringify(result);
  }
}
