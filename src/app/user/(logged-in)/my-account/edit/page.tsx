import { BarkH2 } from "@/components/bark/bark-typography";
import AccountEditForm from "./_components/account-edit-form";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { redirect } from "next/navigation";

type SearchParams = {
  userName: string;
  userPhoneNumber: string;
  userResidency: string;
  userEmail: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const account = await getMyAccount(actor);
  if (!account) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  return (
    <div className="my-5 ml-[60px] flex flex-col">
      <BarkH2>
        <span className="font-bold">Edit My Account Details</span>
      </BarkH2>
      <AccountEditForm defaultValues={searchParams} />
    </div>
  );
}
