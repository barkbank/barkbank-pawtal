import { AdminCommand, AdminCommandArgs } from "../admin-command";
import { z } from "zod";
import {
  VetAccountSpec,
  VetAccountSpecSchema,
} from "@/lib/bark/models/vet-models";
import { AdminActor } from "../../admin-actor";

const RequestSchema = z.object({
  accounts: z.array(VetAccountSpecSchema),
});

type Request = z.infer<typeof RequestSchema>;

export class AddVetAccounts implements AdminCommand {
  getExampleRequest(): string {
    const example: Request = {
      accounts: [
        {
          vetId: "123",
          vetAccountEmail: "someone@domain",
          vetAccountName: "Someone",
        },
      ],
    };
    return JSON.stringify(example, null, 2);
  }
  async run(args: AdminCommandArgs): Promise<string> {
    const { actor, request } = args;
    const obj = JSON.parse(request);
    const req = RequestSchema.parse(obj);
    const promises = req.accounts.map((spec) => this.insert({ actor, spec }));
    const results = await Promise.all(promises);
    return JSON.stringify({ results });
  }

  private async insert(args: { actor: AdminActor; spec: VetAccountSpec }) {
    const { actor, spec } = args;
    const { result, error } = await actor.addVetAccount({ spec });
    if (error !== undefined) {
      return { status: "ERROR", spec, error };
    }
    const { account } = result;
    return { status: "SUCCESS", account };
  }
}
