import Image from "next/image";
import { BarkH1 } from "../bark-typography";
import { BarkNavRoute } from "../bark-nav";
import Link from "next/link";
import React from "react";
import { RoutePath } from "@/lib/route-path";

const LoginLayout = ({
  logoSrc,
  children,
}: Readonly<{ logoSrc: string; children: React.ReactNode }>) => {
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

  return (
    <div className="relative mt-40 flex min-h-screen w-full flex-col justify-between">
      {/* Hero Section */}
      <div className="flex flex-col items-center px-6 pb-10 sm:mt-0">
        <Image
          src={logoSrc}
          alt="" // Decorative image so alt text is empty
          height={100}
          width={100}
        />
        <div className="mt-4">
          <BarkH1>Bark Bank Canine Blood Donation Pawtal</BarkH1>
        </div>
      </div>
      <div className="border px-6 py-10 sm:py-64">{children}</div>
      {/* Footer */}
      <div className="mt-10 flex min-h-[100px] items-center justify-center bg-grey sm:min-h-[200px]">
        <div className="flex justify-between sm:w-[40%] ">
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
  );
};

export default LoginLayout;
