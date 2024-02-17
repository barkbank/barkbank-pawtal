"use server";

import { getAuthenticatedAccount } from "@/lib/auth";
import { RoutePath } from "@/lib/routes";
import { redirect } from "next/navigation";
import { LogoutButton } from "./_logout";

export default async function Layout(props: { children: React.ReactNode }) {
  const { result: account } = await getAuthenticatedAccount();
  if (!account) {
    redirect(RoutePath.LOGIN_PAGE);
  }
  return (
    <>
      <div>
        Temp Nav Bar | {account.name} ({account.email}) |{" "}
        <LogoutButton>Logout</LogoutButton>
      </div>
      {props.children}
    </>
  );
}
