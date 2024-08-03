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
import { z } from "zod";

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
  const { accountId, xVetAccountId } = await _getAccountIdentifiers({
    accountType,
  });
  if (accountId === undefined) {
    return undefined;
  }
  const stk = _getStk();
  if (stk === undefined) {
    return undefined;
  }
  const out: SessionInfo = { accountType, accountId, stk, xVetAccountId };
  return SessionInfoSchema.parse(out);
}

const _AccountIdentifiersSchema = z.object({
  accountId: z.string().optional(),
  xVetAccountId: z.string().optional(),
});

type _AccountIdentifiers = z.infer<typeof _AccountIdentifiersSchema>;

async function _getAccountIdentifiers(args: {
  accountType: AccountType;
}): Promise<_AccountIdentifiers> {
  const { accountType } = args;
  if (accountType === AccountType.ADMIN) {
    const actor = await getAuthenticatedAdminActor();
    const accountId = actor?.getAdminId();
    return { accountId };
  }
  if (accountType === AccountType.VET) {
    const actor = await getAuthenticatedVetActor();
    const accountId = actor?.getVetId();
    const xVetAccountId = actor?.getLogin()?.account?.vetAccountId;
    return { accountId, xVetAccountId };
  }
  if (accountType === AccountType.USER) {
    const actor = await getAuthenticatedUserActor();
    const accountId = actor?.getUserId();
    return { accountId };
  }
  return {};
}
