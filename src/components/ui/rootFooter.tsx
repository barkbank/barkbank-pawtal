import React from "react";
import { BarkNavRoute } from "../bark/bark-nav";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";

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

const RootFooter = () => {
  return (
    <div className=" flex min-h-[100px] w-full items-center justify-center bg-grey sm:min-h-[200px]">
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
  );
};

export default RootFooter;
