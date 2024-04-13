"use client";

import Image from "next/image";
import React from "react";
import { CircleUser, MenuIcon, XIcon } from "lucide-react";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";
import { IMG_PATH } from "@/lib/image-path";
import { Button } from "@/components/ui/button";
import * as Collapsible from "@radix-ui/react-collapsible";
import { AccountType } from "@/lib/auth-models";

const MobileNav = ({ accountType }: { accountType?: AccountType }) => {
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
            <Button variant="outline" size="icon" id="nav-menu-button">
              {isOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
            </Button>
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content>
          <div className="mx-4 my-2 flex flex-col gap-2">
            <Link
              className="text-right"
              target="_blank"
              href={RoutePath.VISIT_WEBSITE}
            >
              Visit Website
            </Link>
            <Link
              className="text-right"
              target="_blank"
              href={RoutePath.VISIT_FAQ}
            >
              Visit FAQ
            </Link>
            {accountType !== undefined && (
              <Link className="text-right" href={RoutePath.LOGOUT_PAGE}>
                Logout
              </Link>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </nav>
  );
};

const DesktopNav = ({ accountType }: { accountType?: AccountType }) => {
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
        <Link target="_blank" href={RoutePath.VISIT_WEBSITE}>
          Visit Website
        </Link>
        <Link target="_blank" href={RoutePath.VISIT_FAQ}>
          Visit FAQ
        </Link>
        {accountType !== undefined && (
          <Link className="text-right" href={RoutePath.LOGOUT_PAGE}>
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
};

const HeaderItems = ({ accountType }: { accountType?: AccountType }) => {
  return (
    <div className="sticky top-0 z-10" id="nav-bar">
      <div className="md:hidden">
        <MobileNav accountType={accountType} />
      </div>
      <div className="hidden md:block">
        <DesktopNav accountType={accountType} />
      </div>
    </div>
  );
};

export default HeaderItems;
