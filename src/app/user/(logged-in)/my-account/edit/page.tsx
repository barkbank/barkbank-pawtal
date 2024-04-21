import { BarkH2 } from "@/components/bark/bark-typography";
import AccountEditForm from "./_components/account-edit-form";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { redirect } from "next/navigation";
import { UserResidency } from "@/lib/data/db-enums";
import { MyAccount } from "@/lib/user/user-models";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const account = await getMyAccount(actor);
  if (!account) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const { userName, userPhoneNumber, userResidency } = account;
  const props = { userName, userPhoneNumber, userResidency };

  return (
    <div className="m-3 flex flex-col">
      <BarkH2>
        <span className="font-bold">Edit My Account Details</span>
      </BarkH2>
      <AccountEditForm {...props} />
    </div>
  );
}
