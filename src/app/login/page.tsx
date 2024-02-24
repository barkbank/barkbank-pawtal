"use server";

import { getAuthenticatedAccount } from "@/lib/auth";
import LoginForm from "./_LoginForm";
import { RoutePath } from "@/lib/routes";
import { redirect } from "next/navigation";
import { BarkH1 } from "@/components/bark/bark-typography";

export default async function Page() {
  const { result: account } = await getAuthenticatedAccount();
  if (account) {
    redirect(RoutePath.PRIVATE_PAGE);
  }
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center px-6">
        <div className="w-full sm:w-[36rem]">
          <BarkH1>Login</BarkH1>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
