import { BarkContext } from "@/lib/bark/bark-context";
import { AdminActor } from "../admin-actor";

export type AdminCommandArgs = {
  context: BarkContext;
  actor: AdminActor;
  request: string;
};

export interface AdminCommand {
  run(args: AdminCommandArgs): Promise<string>;
}
