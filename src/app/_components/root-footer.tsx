"use client";

import React from "react";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BarkNavRoute } from "@/components/bark/navigation/bark-nav-route";
import { ExternalLink } from "lucide-react";

const footerRoutes: BarkNavRoute[] = [
  {
    label: "About Us",
    href: RoutePath.WEBSITE_ABOUT_US,
  },
  {
    label: "Privacy Policy",
    href: RoutePath.WEBSITE_PRIVACY_POLICY,
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
      className="flex w-full flex-col items-center justify-center bg-grey pb-16 md:flex-row md:pb-0"
    >
      {routes.map((route) => {
        const isLocalPath = route.href.startsWith("/");
        const target = isLocalPath ? "_self" : "_blank";
        return (
          <Link
            className="m-3 flex flex-row gap-1 md:w-48 justify-items-start"
            key={route.label}
            href={route.href}
            target={target}
          >
            <span>{route.label}</span>
            {!isLocalPath && <ExternalLink color="#000" className="w-4"/>}
          </Link>
        );
      })}
    </div>
  );
};

export default RootFooter;
