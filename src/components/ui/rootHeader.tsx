import Image from "next/image";
import React from "react";

import { CircleUser } from "lucide-react";
import { BarkNavRoute } from "../bark/bark-nav";

const RootHeader = () => {
  return (
    <nav>
      <div className="sticky flex items-center justify-between border-b shadow-lg">
        <Image
          src="/bark-bank-logo.svg"
          alt="bark bank logo"
          width={60}
          height={60}
          className="ml-4 md:ml-10"
        />

        <div className="hidden gap-x-4 md:flex md:last:mr-10">
          <a href="/">Home</a>
          <a href="/">About Us</a>
          <a href="/">Be a Donor</a>
          <a href="/">Articles</a>
          <a href="/">FAQ</a>
          <a href="/">Info</a>
          <a href="/user">
            <CircleUser />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default RootHeader;
