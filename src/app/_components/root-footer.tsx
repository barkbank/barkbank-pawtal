"use client";

import React from "react";
import { BarkNavRoute } from "../../components/bark/bark-nav";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

const loginPages: BarkNavRoute[] = [
  {
    label: "Vet Login",
    href: RoutePath.VET_LOGIN_PAGE,
  },
  {
    label: "Admin Login",
    href: RoutePath.ADMIN_LOGIN_PAGE,
  },
];

const RootFooter = () => {
  const session = useSession();
  const { status } = session;
  const routes =
    status === "unauthenticated"
      ? [...footerRoutes, ...loginPages]
      : footerRoutes;

  // Note: So that the dock does not block the footer, a pb-16 padding is added.
  // This is set to pb-0 for md screens and up.
  return (
    <div
      id="bark-footer"
      className="pb-16 flex w-full flex-col items-center justify-center bg-grey md:pb-0 md:flex-row"
    >
      {routes.map((route) => {
        return (
          <Link key={route.label} href={route.href} className="m-3 md:w-32">
            {route.label}
          </Link>
        );
      })}
    </div>
  );
};

export default RootFooter;
