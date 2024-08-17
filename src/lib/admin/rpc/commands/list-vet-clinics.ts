import APP from "@/lib/app";
import { AdminCommand, AdminCommandArgs } from "../admin-command";

export class ListVetClinics implements AdminCommand {
  getExampleRequest(): string {
    return "";
  }

  async run(args: AdminCommandArgs): Promise<string> {
    // WIP: Should call actor.getVetClinics()
    const service = await APP.getVetAccountService();
    const { result, error } = await service.getVetClinics();
    if (error) {
      throw new Error(error);
    }
    return JSON.stringify(result);
  }
}
