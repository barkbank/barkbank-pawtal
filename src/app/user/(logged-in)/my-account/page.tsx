import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { BarkH1 } from "@/components/bark/bark-typography";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkUserContactDetails } from "@/components/bark/bark-user-contact-details";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const account = await actor.getMyAccount();
  if (account === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const { userTitle, userResidency, userName, userEmail, userPhoneNumber } =
    account;

  return (
    <main className="m-3 flex flex-col gap-6">
      <BarkH1>My Account Details</BarkH1>

      <BarkUserContactDetails
        details={{
          userTitle,
          userName,
          userEmail,
          userPhoneNumber,
          userResidency,
        }}
        options={{
          showCreationTime: false,
          showLastContactedTime: false,
        }}
      />
      <div className="flex flex-col gap-3">
        <BarkButton
          className="w-full md:w-40"
          variant="brand"
          href={RoutePath.USER_MY_ACCOUNT_EDIT}
        >
          Edit
        </BarkButton>
      </div>
    </main>
  );
}
