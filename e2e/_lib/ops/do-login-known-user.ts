import { KnownUser } from "../models/known-user";
import { PomContext } from "../pom/core/pom-object";
import { getKnownUser } from "../utils/get-known-user";
import { doUserLoginSequence } from "./do-user-login-sequence";

export async function doLoginKnownUser(
  context: PomContext,
): Promise<KnownUser> {
  const knownUser = getKnownUser();
  const { userEmail } = knownUser;
  await doUserLoginSequence(context, { userEmail });
  return knownUser;
}
