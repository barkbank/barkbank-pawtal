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
  logoSrc: string;
}) {
  const { title, accountType, successPath, logoSrc } = props;
  if (await isLoggedIn(accountType)) {
    redirect(successPath);
  }
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <LoginLayout logoSrc={logoSrc}>
          <div className="mx-auto w-full max-w-[1100px] sm:w-[36rem] md:w-full">
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
