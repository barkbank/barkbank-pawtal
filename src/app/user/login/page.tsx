"use server";

import { RoutePath } from "@/lib/route-path";
import BarkLoginPage from "@/components/bark/login/bark-login-page";
import { AccountType } from "@/lib/auth-models";
import { IMG_PATH } from "@/lib/image-path";
import Link from "next/link";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"User Login"}
      accountType={AccountType.USER}
      successPath={RoutePath.USER_DEFAULT_LOGGED_IN_PAGE}
      logoSrc={IMG_PATH.ORANGE_DOG_HOUSE}
      noAccountErrorMessage={
        <>
          User account does not exist. Click{" "}
          <Link href={RoutePath.USER_REGISTRATION} className="text-blue-700">
            here
          </Link>{" "}
          to register.
        </>
      }
    />
  );
}
