import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { APP_ENV } from "./lib/app-env";

function responseWithStatus(status: number) {
  return NextResponse.json({ _error: { status } }, { status });
}

const _404_NOT_FOUND = responseWithStatus(404);
const _401_UNAUTHORIZED = responseWithStatus(401);
const _403_FORBIDDEN = responseWithStatus(403);
const _AUTHORIZATION_HEADER = "Authorization";

/**
 * Authenticate and Authorise calls to the Dangerous API
 *
 * @returns null if access is granted; an error response otherwise.
 */
export async function authDangerous(
  request: NextRequest,
  envs: NodeJS.Dict<string>,
): Promise<Response | null> {
  if (envs[APP_ENV.NODE_ENV] !== "development") {
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

export async function middleware(request: NextRequest): Promise<Response> {
  const method = request.method;
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/dangerous/")) {
    const errorResponse = await authDangerous(request, process.env);
    if (errorResponse) {
      console.warn(`Access Rejected for Dangerous API: ${method} ${path}`);
      return errorResponse;
    }
    console.warn(`Access Granted for Dangerous API: ${method} ${path}`);
    return NextResponse.next();
  }

  // Every request given to middleware should have some handler. If the code
  // gets here, we need to update the matcher in the config.
  throw new Error(`No middleware handler for path: ${path}`);
}

export const config = {
  matcher: "/api/dangerous/:path*",
};
