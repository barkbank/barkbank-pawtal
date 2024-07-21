import { z } from "zod";
import { AdminCommand, AdminCommandArgs } from "../admin-command";
import { SecureVetAccountDao } from "@/lib/bark/daos/secure-vet-account-dao";

const _RequestSchema = z.object({ vetAccountId: z.string() });

export class DeleteVetAccount implements AdminCommand {
  async run(args: AdminCommandArgs): Promise<string> {
    const { context, request } = args;
    const obj = JSON.parse(request);
    const { vetAccountId } = _RequestSchema.parse(obj);
    const { dbPool } = context;
    const dao = new SecureVetAccountDao(dbPool);
    const didDelete = await dao.deleteByVetAccountId({ vetAccountId });
    return JSON.stringify({ didDelete });
  }

  getExampleRequest(): string {
    return JSON.stringify({ vetAccountId: "123" });
  }
}
