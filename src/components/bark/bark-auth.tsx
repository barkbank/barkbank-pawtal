"use client";

import { SessionProvider } from "next-auth/react";

export default function BarkAuthProvider(props: { children: React.ReactNode }) {
  return <SessionProvider>{props.children}</SessionProvider>;
}
