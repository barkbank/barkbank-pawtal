"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export type BarkNavRoute = {
  href: string;
  label: string;
};

export default function BarkNav(props: { routes: BarkNavRoute[] }) {
  const onLogoutClicked = async () => {
    signOut();
  };
  return (
    <div className="flex w-full flex-row gap-9 bg-slate-50 p-3 shadow-md">
      {props.routes.map((route) => {
        return (
          <div key={route.label} className="text-lg">
            <Link href={route.href}>{route.label}</Link>
          </div>
        );
      })}
      <div className="cursor-pointer text-lg" onClick={onLogoutClicked}>
        Logout
      </div>
    </div>
  );
}
