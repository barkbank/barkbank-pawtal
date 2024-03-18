import Image from "next/image";
import React from "react";

import { CircleUser } from "lucide-react";
import { RoutePath } from "@/lib/route-path";
import { usePathname } from "next/navigation";
import { getLoggedInSession } from "@/lib/auth";

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
          <a href="/">Home</a>
          <a href={RoutePath.ABOUT_US}>About Us</a>
          <a href={RoutePath.BE_A_DONOR}>Be a Donor</a>
          <a href={RoutePath.ARTICLES}>Articles</a>
          <a href={RoutePath.FAQ}>FAQ</a>
          <a href={RoutePath.INFO}>Info</a>
          <a href={`/${accountType?.toLowerCase()}/dashboard`}>
            <CircleUser />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default RootHeader;
