"use server";

import { AdminCommandDispatcher } from "@/lib/admin/rpc/admin-command-dispatcher";
import { CommandName, isCommandName } from "@/lib/admin/rpc/command-index";
import APP from "@/lib/app";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";

export async function postAdminCommand(args: {
  commandName: string;
  request: string;
}): Promise<Result<string, string>> {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    return Err(CODE.ERROR_NOT_LOGGED_IN);
  }
  try {
    const { commandName, request } = args;
    if (!isCommandName(commandName)) {
      return Err(CODE.ERROR_NOT_IMPLEMENTED);
    }
    const context = await APP.getBarkContext();
    const dispatcher = new AdminCommandDispatcher({ context, actor });
    const result = await dispatcher.dispatch({ commandName, request });
    return Ok(result);
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
