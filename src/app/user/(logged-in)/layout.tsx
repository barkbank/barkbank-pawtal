"use server";

import BarkNav, { BarkNavRoute } from "@/components/bark/bark-nav";
import { AccountType, isLoggedIn } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  if (!await isLoggedIn(AccountType.USER)) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const navRoutes: BarkNavRoute[] = [
    {
      label: "My Account",
      href: RoutePath.USER_MY_ACCOUNT_PAGE,
    },
  ];
  return (
    <>
      <BarkNav routes={navRoutes} />
      <div className="p-3">{props.children}</div>
    </>
  );
}
