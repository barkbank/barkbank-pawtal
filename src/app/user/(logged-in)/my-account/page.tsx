"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { IMG_PATH } from "@/lib/image-path";
import { getMyLatestCall } from "@/lib/user/actions/get-my-latest-call";
import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { formatDistanceStrict } from "date-fns";
import { BarkH1, BarkH4 } from "@/components/bark/bark-typography";
import Link from "next/link";
import Image from "next/image";

import { capitalize } from "lodash";
import { formatDateTime, SINGAPORE_TIME_ZONE } from "@/lib/utilities/bark-time";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const account = await getMyAccount(actor);
  if (!account) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const {
    userCreationTime,
    userResidency,
    userName,
    userEmail,
    userPhoneNumber,
  } = account;

  let latestCall = (await getMyLatestCall(actor))?.userLastContactedTime;
  const latestCallText = latestCall
    ? formatDistanceStrict(latestCall, new Date(), { addSuffix: true })
    : "N.A";

  const userCreationTimeText = formatDateTime(userCreationTime, {
    format: "dd MMM yyyy",
    timeZone: SINGAPORE_TIME_ZONE,
  });

  return (
    <main className="flex flex-col gap-6">
      <BarkH1>My Account Details</BarkH1>

      <div className="flex flex-col gap-2">
        <div className="mb-[7px] flex flex-col gap-[7px]">
          <BarkH4>{userName}</BarkH4>
          <p className="text-xs italic text-grey-60">
            Account created on: {userCreationTimeText}
          </p>
          <p className="text-xs italic text-grey-60">
            Last contacted: {latestCallText}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-[10px]">
            <Image
              src={IMG_PATH.LOCATION_MARKER}
              width={25}
              height={20}
              alt="location marker icon"
            />
            {capitalize(userResidency)}
          </p>
          <p className="flex items-center gap-[10px]">
            <Image
              src={IMG_PATH.LETTER}
              width={25}
              height={20}
              alt="letter icon"
            />
            {userEmail}
          </p>
          <p className="flex items-center gap-[10px]">
            <Image
              src={IMG_PATH.PHONE}
              width={25}
              height={20}
              alt="phone icon icon"
            />
            {userPhoneNumber}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">User ID Number</p>
        <p>{actor.getUserId()}</p>
      </div>
      <div className="flex gap-3">
        <Link
          className={`h-[60px] ${buttonVariants({ variant: "brand" })}`}
          href={RoutePath.USER_MY_ACCOUNT_EDIT}
        >
          Edit
        </Link>
        <Button className="h-[60px]" variant={"brandInverse"}>
          Delete
        </Button>
      </div>
    </main>
  );
}
