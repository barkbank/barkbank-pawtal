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
    <nav className="sticky top-0 z-10 border-b bg-white shadow-lg">
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
            <Button variant="outline" size="icon">
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
            <Link href={RoutePath.ROOT}>Home</Link>
            <Link href={RoutePath.ABOUT_US}>About Us</Link>
            <Link href={RoutePath.BE_A_DONOR}>Be a Donor</Link>
            <Link href={RoutePath.ARTICLES}>Articles</Link>
            <Link href={RoutePath.FAQ}>FAQ</Link>
            <Link href={RoutePath.INFO}>Info</Link>
            <Link href={RoutePath.ACCOUNT_DASHBOARD(accountType)}>
              <CircleUser />
            </Link>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </nav>
  );
};

const DesktopNav = ({ accountType }: { accountType?: AccountType }) => {
  return (
    <nav className="sticky top-0 z-10 flex h-[72px] flex-row items-center justify-between border-b bg-white shadow-lg">
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
        <Link href={RoutePath.ROOT}>Home</Link>
        <Link href={RoutePath.ABOUT_US}>About Us</Link>
        <Link href={RoutePath.BE_A_DONOR}>Be a Donor</Link>
        <Link href={RoutePath.ARTICLES}>Articles</Link>
        <Link href={RoutePath.FAQ}>FAQ</Link>
        <Link href={RoutePath.INFO}>Info</Link>
        <Link href={RoutePath.ACCOUNT_DASHBOARD(accountType)}>
          <CircleUser />
        </Link>
      </div>
    </nav>
  );
};

const HeaderItems = ({ accountType }: { accountType?: AccountType }) => {
  return (
    <>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="hidden md:block">
        <DesktopNav />
      </div>
    </>
  );
};

export default HeaderItems;
