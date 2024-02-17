import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Err, Ok, Result } from "./result";
import { guaranteed } from "./stringutils";

export const NEXT_AUTH_OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials, req) {
        console.log("Received credentials:", credentials);
        try {
          if (!credentials || !credentials.email || !credentials.otp) {
            return null;
          }
          console.log("Credentials:", credentials);
          if (credentials.otp !== "123456") {
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
  secret: guaranteed(process.env.NEXTAUTH_SECRET),
  pages: {
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
  return Ok({ email, name });
}
