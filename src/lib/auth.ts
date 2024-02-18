import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Err, Ok, Result } from "./result";
import { guaranteed } from "./stringutils";
import { getCurrentPeriod, getOtp } from "./otp";

export const NEXT_AUTH_OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Name MUST be "credentials" for signIn to work.
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials || !credentials.email || !credentials.otp) {
            return null;
          }
          const recentOtps = getRecentOtps(credentials.email);
          if (!recentOtps.includes(credentials.otp)) {
            return null;
          }
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    // This tells NextAuth to use the /login page instead of /api/auth/signin.
    signIn: "/login",
  },
};

function getOtpConfig(): {
  recentPeriods: number;
  periodMillis: number;
  serverSecret: string;
} {
  return {
    recentPeriods: parseInt(guaranteed(process.env.OTP_NUM_RECENT_PERIODS)),
    periodMillis: parseInt(guaranteed(process.env.OTP_PERIOD_MILLIS)),
    serverSecret: guaranteed(process.env.OTP_SECRET),
  };
}

export function getCurrentOtp(email: string): string {
  const { periodMillis, serverSecret } = getOtpConfig();
  return getOtp({
    email,
    period: getCurrentPeriod(periodMillis),
    serverSecret: serverSecret,
  });
}

export function getRecentOtps(email: string): string[] {
  const { periodMillis, serverSecret, recentPeriods } = getOtpConfig();
  const currentPeriod = getCurrentPeriod(periodMillis);
  const otps: string[] = [];
  for (let i = -recentPeriods; i <= 0; ++i) {
    otps.push(
      getOtp({
        email,
        period: currentPeriod + i,
        serverSecret: serverSecret,
      }),
    );
  }
  return otps;
}

export async function getAuthenticatedAccount(): Promise<
  Result<{ email: string; name: string }, "NO_SESSION">
> {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);
  if (!session || !session.user || !session.user.email || !session.user.name) {
    return Err("NO_SESSION");
  }
  const { email, name } = session.user;
  // TODO: Retrieve some user details from DB in future.
  return Ok({ email, name });
}
