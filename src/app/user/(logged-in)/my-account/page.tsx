import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { getMyLatestCall } from "@/lib/user/actions/get-my-latest-call";
import { BarkH1 } from "@/components/bark/bark-typography";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkUserContactDetails } from "@/components/bark/bark-user-contact-details";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const [account, latestCallResult] = await Promise.all([
    actor.getMyAccount(),
    getMyLatestCall(actor),
  ])
  if (account === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const {
    userCreationTime,
    userResidency,
    userName,
    userEmail,
    userPhoneNumber,
  } = account;
  const userLastContactedTime =
    latestCallResult.result?.userLastContactedTime ?? undefined;

  return (
    <main className="m-3 flex flex-col gap-6">
      <BarkH1>My Account Details</BarkH1>

      <BarkUserContactDetails
        details={{
          userName,
          userEmail,
          userPhoneNumber,
          userResidency,
          userCreationTime,
          userLastContactedTime,
        }}
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">User ID Number</p>
        <p>{actor.getUserId()}</p>
      </div>

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
