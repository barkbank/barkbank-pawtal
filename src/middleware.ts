import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { APP_ENV } from "./lib/app-env";
import { BARKBANK_ENV } from "./lib/barkbank-env";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "./lib/cookie-names";

export async function middleware(request: NextRequest): Promise<Response> {
  const method = request.method;
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/dangerous/")) {
    const errorResponse = await _authDangerous(request, process.env);
    if (errorResponse) {
      console.warn(`Access Rejected for Dangerous API: ${method} ${path}`);
      return errorResponse;
    }
    console.warn(`Access Granted for Dangerous API: ${method} ${path}`);
    return NextResponse.next();
  }
  // WIP: Remove these ctk and stk things.
  const ctk = _getCtk();
  const stk = _getStk();
  const url = request.url;
  console.log(JSON.stringify({ ctk, stk, url }));
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};

function _getCtk() {
  return cookies().get(COOKIE_NAME.CTK)?.value;
}

function _getStk() {
  const ck = cookies();
  if (ck.has(COOKIE_NAME.NEXT_AUTH_SESSION_TOKEN)) {
    return cookies().get(COOKIE_NAME.STK)?.value;
  }
  return undefined;
}

function _responseWithStatus(status: number) {
  return NextResponse.json({ _error: { status } }, { status });
}

const _404_NOT_FOUND = _responseWithStatus(404);
const _401_UNAUTHORIZED = _responseWithStatus(401);
const _403_FORBIDDEN = _responseWithStatus(403);
const _AUTHORIZATION_HEADER = "Authorization";

/**
 * Authenticate and Authorise calls to the Dangerous API.
 *
 * @returns null if access is granted; an error response otherwise.
 */
// @VisibleForTesting
export async function _authDangerous(
  request: NextRequest,
  envs: NodeJS.Dict<string>,
): Promise<Response | null> {
  const barkbankEnv = envs[APP_ENV.BARKBANK_ENV];
  const isAllowedEnv =
    barkbankEnv === BARKBANK_ENV.DEVELOPMENT ||
    barkbankEnv === BARKBANK_ENV.TEST;
  if (!isAllowedEnv) {
    return _404_NOT_FOUND;
  }
  const cred = envs[APP_ENV.DANGEROUS_CREDENTIALS];
  if (!cred) {
    return _401_UNAUTHORIZED;
  }
  const base64Cred = Buffer.from(cred).toString("base64");
  const authVal = request.headers.get(_AUTHORIZATION_HEADER);
  if (authVal !== `Basic ${base64Cred}`) {
    return _401_UNAUTHORIZED;
  }
  const isEnabled = envs[APP_ENV.DANGEROUS_ENABLED];
  if (!isEnabled || isEnabled !== "true") {
    return _403_FORBIDDEN;
  }
  return null;
}
