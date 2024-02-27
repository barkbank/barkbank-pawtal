import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Err, Ok, Result } from "./result";
import APP from "./app";
import { AdminActor } from "./admin/admin-actor";
import { VetActor } from "./vet/vet-actor";

export enum AccountType {
  USER = "USER",
  VET = "VET",
  ADMIN = "ADMIN",
}

export const NEXT_AUTH_OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Name MUST be "credentials" for signIn to work.
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
        accountType: { label: "Account Type", type: "text" },
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
          const authUser = {
            id: credentials.email,
            email: credentials.email,
            name: credentials.accountType || "NONE",
          };
          if (credentials.accountType === "ADMIN") {
            const adminActor = await getAdminActorByEmail(credentials.email);
            if (adminActor === null) {
              return null;
            }
            return authUser;
          }
          if (credentials.accountType === "VET") {
            const vetActor = await getVetActorByEmail(credentials.email);
            if (vetActor === null) {
              return null;
            }
            return authUser;
          }
          // WIP: USER account type, UserActor, etc.
          return authUser;
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

export async function isLoggedIn(accountType: AccountType): Promise<boolean> {
  const session = await getLoggedInSession();
  if (session === null) {
    return false;
  }
  return accountType === session.accountType;
}

export async function getAuthenticatedAdminActor(): Promise<AdminActor | null> {
  const session = await getLoggedInSession();
  if (session === null || session.accountType !== AccountType.ADMIN) {
    return null;
  }
  return getAdminActorByEmail(session.email);
}

export async function getAuthenticatedVetActor(): Promise<VetActor | null> {
  const session = await getLoggedInSession();
  if (session === null || session.accountType !== AccountType.VET) {
    return null;
  }
  return getVetActorByEmail(session.email);
}

async function getLoggedInSession(): Promise<{email: string, accountType: AccountType} | null> {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);
  if (!session || !session.user || !session.user.email || !session.user.name) {
    return null;
  }
  const { email, name } = session.user;
  const accountType = name as AccountType;
  return {email, accountType};
}

async function getAdminActorByEmail(email: string): Promise<AdminActor | null> {
  const factory = await APP.getAdminActorFactory();
  const actor = await factory.getAdminActor(email);
  return actor;
}

async function getVetActorByEmail(email: string): Promise<VetActor | null> {
  const factory = await APP.getVetActorFactory();
  const actor = await factory.getVetActor(email);
  return actor;
}
