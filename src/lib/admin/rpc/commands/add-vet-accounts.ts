import { BarkContext } from "@/lib/bark/bark-context";
import { AdminCommand, AdminCommandArgs } from "../admin-command";
import { z } from "zod";
import {
  VetAccountSpec,
  VetAccountSpecSchema,
} from "@/lib/bark/models/vet-models";
import { opAddVetAccount } from "@/lib/bark/operations/op-add-vet-account";

const RequestSchema = z.object({
  accounts: z.array(VetAccountSpecSchema),
});

export class AddVetAccounts implements AdminCommand {
  async run(args: AdminCommandArgs): Promise<string> {
    const { context, request } = args;
    const obj = JSON.parse(request);
    const req = RequestSchema.parse(obj);
    const promises = req.accounts.map((spec) => this.insert({ context, spec }));
    const results = await Promise.all(promises);
    return JSON.stringify({ results });
  }

  private async insert(args: { context: BarkContext; spec: VetAccountSpec }) {
    const { context, spec } = args;
    const { result, error } = await opAddVetAccount(context, { spec });
    if (error !== undefined) {
      return { status: "ERROR", spec, error };
    }
    const { account } = result;
    return { status: "SUCCESS", account };
  }
}
