"use server";

import { getLoggedInSession } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { LogoutQuestion } from "./_components";

export default async function Page() {
  const session = await getLoggedInSession();
  if (session === null) {
    redirect(RoutePath.ROOT);
  }
  return <LogoutQuestion />;
}
