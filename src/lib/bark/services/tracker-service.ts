import { BarkContext } from "../bark-context";
import { COOKIE_NAME } from "@/lib/cookie-names";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import {
  ClientInfo,
  ClientInfoSchema,
  CookieInfo,
  CookieInfoSchema,
  SessionInfo,
  SessionInfoSchema,
  PageLoadEvent,
} from "@/lib/bark/models/tracker-models";
import {
  getAuthenticatedAdminActor,
  getAuthenticatedUserActor,
  getAuthenticatedVetActor,
  getLoggedInSession,
} from "@/lib/auth";
import { AccountType } from "@/lib/auth-models";
import { PawtalEventsDao } from "../daos/pawtal-events-dao";

export class TrackerService {
  constructor(private context: BarkContext) {}

  async onPageLoad(args: { clientInfo: ClientInfo }): Promise<void> {
    const clientInfo = ClientInfoSchema.parse(args.clientInfo);
    const cookieInfo = _getCookieInfo();
    const sessionInfo = await _getSessionInfo();
    const pageLoadEvent: PageLoadEvent = {
      eventTs: new Date(),
      ...clientInfo,
      ...cookieInfo,
      ...sessionInfo,
    };
    const dao = new PawtalEventsDao(this.context.dbPool);
    await dao.insertPageLoadEvent({ pageLoadEvent });
    console.log({ pageLoadEvent });
  }
}

function _getCookieInfo(): CookieInfo {
  const ctk = _getOrCreateCtk();
  const out: CookieInfo = { ctk };
  return CookieInfoSchema.parse(out);
}

function _getOrCreateCtk(): string {
  const existing = cookies().get(COOKIE_NAME.CTK);
  if (existing !== undefined) {
    return existing.value;
  }
  const ctk = randomUUID();
  cookies().set(COOKIE_NAME.CTK, ctk);
  return ctk;
}

function _getStk(): string | undefined {
  return cookies().get(COOKIE_NAME.STK)?.value;
}

async function _getSessionInfo(): Promise<SessionInfo | undefined> {
  const session = await getLoggedInSession();
  if (session === null) {
    return undefined;
  }
  const { accountType } = session;
  const accountId = await _getAccountId({ accountType });
  if (accountId === undefined) {
    return undefined;
  }
  const stk = _getStk();
  if (stk === undefined) {
    return undefined;
  }
  const out: SessionInfo = { accountType, accountId, stk };
  return SessionInfoSchema.parse(out);
}

async function _getAccountId(args: {
  accountType: AccountType;
}): Promise<string | undefined> {
  const { accountType } = args;
  if (accountType === AccountType.ADMIN) {
    return (await getAuthenticatedAdminActor())?.getAdminId();
  }
  if (accountType === AccountType.VET) {
    return (await getAuthenticatedVetActor())?.getVetId();
  }
  if (accountType === AccountType.USER) {
    return (await getAuthenticatedUserActor())?.getUserId();
  }
  return undefined;
}
