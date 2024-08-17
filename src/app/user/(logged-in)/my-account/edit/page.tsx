import { BarkH2 } from "@/components/bark/bark-typography";
import AccountEditForm from "./_components/account-edit-form";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { UserAccountUpdateSchema } from "@/lib/bark/models/user-models";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const account = await actor.getMyAccount();
  if (account === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const existing = UserAccountUpdateSchema.parse(account);

  return (
    <div className="m-3 flex flex-col">
      <BarkH2>
        <span className="font-bold">Edit My Account Details</span>
      </BarkH2>
      <AccountEditForm existing={existing} />
    </div>
  );
}
