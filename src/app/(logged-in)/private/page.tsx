"use server";

import { getAuthenticatedAccount } from "@/lib/auth";
import { RoutePath } from "@/lib/routes";
import { redirect } from "next/navigation";
import { LogoutLink } from "../_logout";

export default async function Page() {
  return (
    <>
      <p>Private content</p>
    </>
  );
}
