import { AdminCommand, AdminCommandArgs } from "../admin-command";

export class ListVetClinics implements AdminCommand {
  getExampleRequest(): string {
    return "";
  }

  async run(args: AdminCommandArgs): Promise<string> {
    const { actor } = args;
    const { result, error } = await actor.getVetClinics();
    if (error) {
      throw new Error(error);
    }
    return JSON.stringify(result);
  }
}
