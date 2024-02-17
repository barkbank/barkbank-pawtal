"use server";

import { getAuthenticatedAccount } from "@/lib/auth";
import LoginForm from "./_LoginForm";
import { RoutePath } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function Page() {
  const { result: account } = await getAuthenticatedAccount();
  if (account) {
    redirect(RoutePath.PRIVATE_PAGE);
  }
  return (
    <>
      <LoginForm />
    </>
  );
}
