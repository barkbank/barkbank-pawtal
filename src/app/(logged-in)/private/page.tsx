"use server";

import { getAuthenticatedAccount } from "@/lib/auth";
import { RoutePath } from "@/lib/routes";
import { redirect } from "next/navigation";
import { LogoutButton } from "./_LogoutButton";

export default async function Page() {
  const { result: account } = await getAuthenticatedAccount();
  if (!account) {
    redirect(RoutePath.LOGIN_PAGE);
  }
  return (
    <>
      <p>
        Welcome {account.name} ({account.email}) to the private area
      </p>
      <LogoutButton>Logout</LogoutButton>
    </>
  );
}
