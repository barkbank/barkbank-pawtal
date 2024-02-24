import NextAuth from "next-auth";
import { NEXT_AUTH_OPTIONS } from "@/lib/auth";

const handler = NextAuth(NEXT_AUTH_OPTIONS);
export { handler as GET, handler as POST };
