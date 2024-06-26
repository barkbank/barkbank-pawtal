import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarkH1, BarkH2 } from "@/components/bark/bark-typography";
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
    <>
      <div className="my-10 flex flex-col items-center">
        {/* Hero Section */}
        <div className=" flex w-full flex-col items-center px-6">
          <Image
            src={logoSrc}
            alt="" // Decorative image so alt text is empty
            height={100}
            width={100}
          />
          <div className="my-4 text-center">
            <BarkH1>Bark Bank Canine Blood Donation Pawtal</BarkH1>
          </div>
        </div>
        <div className="w-full max-w-[1000px] px-3">
          <BarkH2>{title}</BarkH2>
          <BarkLoginForm
            accountType={accountType}
            successPath={successPath}
            noAccountErrorMessage={noAccountErrorMessage}
            emailDescription={emailDescription}
          />
        </div>
      </div>
    </>
  );
}
