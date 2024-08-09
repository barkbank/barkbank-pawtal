"use client";

import Image from "next/image";
import React from "react";
import { ExternalLink, MenuIcon, XIcon } from "lucide-react";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";
import { IMG_PATH } from "@/lib/image-path";
import { Button } from "@/components/ui/button";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useSession } from "next-auth/react";

type NavOption = {
  label: string;
  href: string;
  target?: "_blank";
};

const WEBSITE_NAV_OPTIONS: NavOption[] = [
  {
    label: "Visit Website",
    href: RoutePath.WEBSITE_URL,
    target: "_blank",
  },
];

const AUTHENTICATED_OPTIONS: NavOption[] = [
  {
    label: "Logout",
    href: RoutePath.LOGOUT_PAGE,
  },
];

const MobileNav = (props: { navOptions: NavOption[] }) => {
  const { navOptions } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="border-b bg-white shadow-lg">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <div className="mx-3 flex min-h-[72px] flex-row items-center justify-between">
          <Link href={RoutePath.ROOT} className="w-[60px]">
            <Image
              src={IMG_PATH.BARK_BANK_LOGO}
              alt="bark bank logo"
              width={60}
              height={60}
            />
          </Link>

          <Collapsible.Trigger asChild>
            <Button variant="outline" size="icon" id="bark-nav-menu-button">
              {isOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
            </Button>
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content>
          <div className="mx-4 my-2 flex flex-col items-end gap-6">
            {navOptions.map((option) => {
              const { label, href, target } = option;
              const isLocalPath = href.startsWith("/");
              return (
                <Link
                  key={label}
                  className="text-xl"
                  target={target}
                  href={href}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex flex-row gap-1">
                    {label}
                    {!isLocalPath && (
                      <ExternalLink color="#000" className="w-4" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </nav>
  );
};

const DesktopNav = (props: { navOptions: NavOption[] }) => {
  const { navOptions } = props;
  return (
    <nav className="flex h-[72px] flex-row items-center justify-between border-b bg-white shadow-lg">
      <div className="ml-8 w-[72px] flex-none">
        <Link href={RoutePath.ROOT}>
          <Image
            src={IMG_PATH.BARK_BANK_LOGO}
            alt="bark bank logo"
            width={60}
            height={60}
          />
        </Link>
      </div>

      <div className="mr-8 flex gap-8 gap-x-8">
        {navOptions.map((option) => {
          const { label, href, target } = option;
          const isLocalPath = href.startsWith("/");
          return (
            <Link
              key={label}
              target={target}
              href={href}
              className="flex flex-row gap-1"
            >
              {label}
              {!isLocalPath && <ExternalLink color="#000" className="w-4" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const HeaderItems = () => {
  const session = useSession();
  const { status } = session;
  const isAuthenticated = status === "authenticated";
  const navOptions: NavOption[] = isAuthenticated
    ? [...WEBSITE_NAV_OPTIONS, ...AUTHENTICATED_OPTIONS]
    : WEBSITE_NAV_OPTIONS;
  return (
    <div className="sticky top-0 z-10" id="bark-nav-bar">
      <div className="md:hidden">
        <MobileNav navOptions={navOptions} />
      </div>
      <div className="hidden md:block">
        <DesktopNav navOptions={navOptions} />
      </div>
    </div>
  );
};

export default HeaderItems;
