"use server";

import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarkH1 } from "@/components/bark/bark-typography";
import { AccountType } from "@/lib/auth";
import BarkLoginForm from "./bark-login-form";
import LoginLayout from "./layout";

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
      <div className="flex h-screen flex-col items-center justify-center">
        <LoginLayout accountType={accountType}>
          <div className="w-full sm:w-[36rem]">
            <BarkH1>{title}</BarkH1>
            <BarkLoginForm
              accountType={accountType}
              successPath={successPath}
            />
          </div>
        </LoginLayout>
      </div>
    </>
  );
}
