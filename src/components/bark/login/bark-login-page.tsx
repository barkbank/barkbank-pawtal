import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import BarkLoginForm from "./bark-login-form";
import Image from "next/image";
import { AccountType } from "@/lib/auth-models";

export default async function BarkLoginPage(props: {
  title: string;
  accountType: AccountType;
  successPath: string;
  logoSrc: string;
  noAccountErrorMessage: string | React.ReactNode;
  emailDescription?: string | React.ReactNode;
}) {
  const {
    title,
    accountType,
    successPath,
    logoSrc,
    noAccountErrorMessage,
    emailDescription,
  } = props;
  if (await isLoggedIn(accountType)) {
    redirect(successPath);
  }
  return (
    <div className="flex min-h-screen w-full flex-row justify-center px-3 py-6">
      <div className="flex w-full max-w-screen-md flex-col items-center gap-3">
        <Image src={logoSrc} alt="login logo" height={100} width={100} />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Canine Blood Donation Pawtal</h1>
        </div>
        <div className="w-full px-3">
          <h2 className="text-2xl">{title}</h2>
          <BarkLoginForm
            accountType={accountType}
            successPath={successPath}
            noAccountErrorMessage={noAccountErrorMessage}
            emailDescription={emailDescription}
          />
        </div>
      </div>
    </div>
  );
}
