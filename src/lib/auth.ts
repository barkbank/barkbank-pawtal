import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Err, Ok, Result } from "./result";
import APP from "./app";

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
          const otpService = await APP.getOtpService();
          const recentOtps = await otpService.getRecentOtps(credentials.email);
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
