"use server";

import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarkH1, BarkH2 } from "@/components/bark/bark-typography";
import { AccountType } from "@/lib/auth";
import BarkLoginForm from "./bark-login-form";
import { BarkNavRoute } from "../bark-nav";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";
import Image from "next/image";

const footerRoutes: BarkNavRoute[] = [
  {
    label: "Contact us",
    href: RoutePath.CONTACT_US,
  },
  {
    label: "Privacy Policy",
    href: RoutePath.PRIVACY_POLICY,
  },
  {
    label: "Terms & Conditions",
    href: RoutePath.TERMS_AND_CONDITIONS,
  },
];

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
      <div className="flex min-h-screen flex-col items-center justify-between">
        {/* Hero Section */}
        <div className="mt-20 flex w-full flex-col items-center px-6 pb-10 sm:mt-32">
          <Image
            src={logoSrc}
            alt="" // Decorative image so alt text is empty
            height={100}
            width={100}
          />
          <div className="mt-4 text-center">
            <BarkH1>Bark Bank Canine Blood Donation Pawtal</BarkH1>
          </div>
        </div>
        <div className="mx-auto max-w-[1100px] sm:w-[36rem] sm:px-6 sm:py-10 md:w-full ">
          <BarkH2>{title}</BarkH2>
          <BarkLoginForm accountType={accountType} successPath={successPath} />
        </div>

        {/* Footer */}
        <div className="mt-10 flex min-h-[100px] w-full items-center justify-center bg-grey sm:min-h-[200px]">
          <div className="flex sm:w-[40%]">
            {footerRoutes.map((route) => {
              return (
                <Link
                  key={route.label}
                  href={route.href}
                  className="w-20 sm:w-full"
                >
                  {route.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
