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

const HeaderItems = ({ accountType }: { accountType?: AccountType }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-10 flex min-h-[72px] items-center justify-between border-b bg-white shadow-lg">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <div className="mx-4 flex min-h-[72px] items-center gap-2 md:mx-10">
          <Collapsible.Trigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              {isOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
            </Button>
          </Collapsible.Trigger>

          <Link href={RoutePath.ROOT}>
            <Image
              src={IMG_PATH.BARK_BANK_LOGO}
              alt="bark bank logo"
              width={60}
              height={60}
            />
          </Link>
        </div>

        <Collapsible.Content>
          <div className="mx-4 my-2 flex flex-col gap-2 md:hidden">
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

      <div className="hidden gap-x-8 sm:flex sm:last:mr-8">
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

export default HeaderItems;
