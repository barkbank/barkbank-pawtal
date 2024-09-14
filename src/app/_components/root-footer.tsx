"use client";

import React from "react";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BarkNavRoute } from "@/components/bark/navigation/bark-nav-route";
import { ExternalLink } from "lucide-react";
import { VERSION } from "../../lib/version";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const footerRoutes: BarkNavRoute[] = [
  {
    label: "About Us",
    href: RoutePath.WEBSITE_ABOUT_US,
  },
  {
    label: "Terms of Use",
    href: RoutePath.WEBSITE_TERMS_OF_USE,
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
  const pathname = usePathname();
  const session = useSession();
  const { status } = session;
  const isUnauthenticated = status === "unauthenticated";
  const isAuthenticated = status === "authenticated";
  const isLogoutPage = pathname === RoutePath.LOGOUT_PAGE;
  const shouldAddPaddingForDock = isAuthenticated && !isLogoutPage;
  const routes = isUnauthenticated
    ? [...footerRoutes, ...loginPages]
    : footerRoutes;

  // Note: So that the dock does not block the footer, a pb-16 padding is added.
  // This is set to pb-0 for md screens and up.
  return (
    <div className={clsx({ "pb-16 md:pb-0": shouldAddPaddingForDock })}>
      <div
        id="bark-footer"
        className="flex flex-col items-center justify-center bg-grey md:flex-row"
      >
        {routes.map((route) => {
          const isLocalPath = route.href.startsWith("/");
          const target = isLocalPath ? "_self" : "_blank";
          return (
            <Link
              className="m-3 flex flex-row gap-1 md:w-48"
              key={route.label}
              href={route.href}
              target={target}
            >
              <span>{route.label}</span>
              {!isLocalPath && <ExternalLink color="#000" className="w-4" />}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-row justify-center bg-gray-500 p-1 text-sm text-white">
        Bark Bank | Pawtal | Version {VERSION}
      </div>
    </div>
  );
};

export default RootFooter;
