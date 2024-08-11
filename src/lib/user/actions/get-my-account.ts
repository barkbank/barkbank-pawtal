import { UserActor } from "../user-actor";
import { UserAccount } from "../../bark/models/user-models";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";

export async function getMyAccount(
  actor: UserActor,
): Promise<
  Result<
    UserAccount,
    typeof CODE.ERROR_USER_NOT_FOUND | typeof CODE.DB_QUERY_FAILURE
  >
> {
  const account = await actor.getMyAccount();
  if (account === null) {
    return Err(CODE.ERROR_USER_NOT_FOUND);
  }
  return Ok(account);
}
