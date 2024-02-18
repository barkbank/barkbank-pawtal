"use server";

import { getAuthenticatedAccount } from "@/lib/auth";
import { RoutePath } from "@/lib/routes";
import { redirect } from "next/navigation";
import { LogoutLink } from "./_logout";

export default async function Layout(props: { children: React.ReactNode }) {
  const { result: account } = await getAuthenticatedAccount();
  if (!account) {
    redirect(RoutePath.LOGIN_PAGE);
  }
  return (
    <>
      <div>
        Temp Nav Bar | {account.name} ({account.email}) |{" "}
        <LogoutLink>Logout</LogoutLink>
      </div>
      {props.children}
    </>
  );
}
