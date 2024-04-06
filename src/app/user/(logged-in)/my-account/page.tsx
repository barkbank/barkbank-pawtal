"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { IMG_PATH } from "@/lib/image-path";
import { getMyLatestCall } from "@/lib/user/actions/get-my-latest-call";
import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { format, formatDistanceStrict } from "date-fns";
import { BarkH1, BarkH4 } from "@/components/bark/bark-typography";
import Link from "next/link";
import Image from "next/image";

import { capitalize } from "lodash";

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
    userId,
    userCreationTime,
    userResidency,
    ownPii: { userName, userEmail, userPhoneNumber },
  } = account;

  let latestCall = (await getMyLatestCall(actor))?.callCreationTime;
  const latestCallText = latestCall
    ? formatDistanceStrict(latestCall, new Date(), { addSuffix: true })
    : "N.A";

  const userCreationTimeText = format(userCreationTime, "dd MMM yyyy");

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
        <p>{userId}</p>
      </div>
      <div className="flex gap-3">
        <Link
          className={`h-[60px] ${buttonVariants({ variant: "brand" })}`}
          href={"/user/my-account/edit"}
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
