"use server";

import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarkH1 } from "@/components/bark/bark-typography";
import BarkLoginForm from "@/components/bark/bark-login-form";
import { AccountType } from "@/lib/auth";

export default async function BarkLoginPage(props: {
  title: string;
  accountType: AccountType;
  successPath: string;
}) {
  const { title, accountType, successPath } = props;
  if (await isLoggedIn(accountType)) {
    redirect(successPath);
  }
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center px-6">
        <div className="w-full sm:w-[36rem]">
          <BarkH1>{title}</BarkH1>
          <BarkLoginForm accountType={accountType} successPath={successPath} />
        </div>
      </div>
    </>
  );
}
