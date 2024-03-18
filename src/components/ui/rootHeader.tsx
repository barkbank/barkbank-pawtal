import Image from "next/image";
import React from "react";

import { CircleUser } from "lucide-react";
import { RoutePath } from "@/lib/route-path";
import { getLoggedInSession } from "@/lib/auth";
import Link from "next/link";

const RootHeader = async () => {
  const session = await getLoggedInSession();
  const accountType = session?.accountType;

  return (
    <nav>
      <div className="sticky flex items-center justify-between border-b shadow-lg">
        <a href="/">
          <Image
            src="/bark-bank-logo.svg"
            alt="bark bank logo"
            width={60}
            height={60}
            className="ml-4 md:ml-10"
          />
        </a>

        <div className="hidden gap-x-4 sm:flex sm:last:mr-10">
          <Link href="/">Home</Link>
          <Link href={RoutePath.ABOUT_US}>About Us</Link>
          <Link href={RoutePath.BE_A_DONOR}>Be a Donor</Link>
          <Link href={RoutePath.ARTICLES}>Articles</Link>
          <Link href={RoutePath.FAQ}>FAQ</Link>
          <Link href={RoutePath.INFO}>Info</Link>
          <Link href={`/${accountType?.toLowerCase()}/dashboard`}>
            <CircleUser />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default RootHeader;
