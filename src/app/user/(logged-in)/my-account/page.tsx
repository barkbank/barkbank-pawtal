"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { IMG_PATH } from "@/lib/image-path";
import { getMyLatestCall } from "@/lib/user/actions/get-my-latest-call";
import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { formatDistanceStrict } from "date-fns";
import { BarkH1, BarkH4 } from "@/components/bark/bark-typography";
import Image from "next/image";

import { capitalize } from "lodash";
import { formatDateTime, SINGAPORE_TIME_ZONE } from "@/lib/utilities/bark-time";
import { BarkButton } from "@/components/bark/bark-button";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const {
    userCreationTime,
    userResidency,
    userName,
    userEmail,
    userPhoneNumber,
  } = await getMyAccount(actor).then(({ result, error }) => {
    if (error !== undefined) {
      redirect(RoutePath.USER_LOGIN_PAGE);
    }
    return result;
  });

  const latestCallText = await getMyLatestCall(actor).then(
    ({ result, error }) => {
      if (error !== undefined) {
        return "N.A";
      }
      const { userLastContactedTime } = result;
      if (userLastContactedTime === null) {
        return "N.A";
      }
      return formatDistanceStrict(userLastContactedTime, new Date(), {
        addSuffix: true,
      });
    },
  );

  const userCreationTimeText = formatDateTime(userCreationTime, {
    format: "dd MMM yyyy",
    timeZone: SINGAPORE_TIME_ZONE,
  });

  const userDetails: {
    key: string;
    icon: React.ReactNode;
    value: React.ReactNode;
  }[] = [
    {
      key: "location",
      icon: (
        <Image
          src={IMG_PATH.LOCATION_MARKER}
          width={24}
          height={26}
          alt="location marker icon"
          className="h-full w-auto"
        />
      ),
      value: capitalize(userResidency),
    },
    {
      key: "email",
      icon: (
        <Image
          src={IMG_PATH.LETTER}
          width={26}
          height={20}
          alt="letter icon"
          className="h-auto w-full"
        />
      ),
      value: userEmail,
    },
    {
      key: "phone",
      icon: (
        <Image
          src={IMG_PATH.PHONE}
          width={30}
          height={30}
          alt="phone icon icon"
          className="h-full w-auto"
        />
      ),
      value: userPhoneNumber,
    },
  ];

  return (
    <main className="m-3 flex flex-col gap-6">
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
          {userDetails.map((detail) => {
            const { key, icon, value } = detail;
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex h-[25px] w-[25px] place-content-center justify-items-center">
                  {icon}
                </div>
                <div>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">User ID Number</p>
        <p>{actor.getUserId()}</p>
      </div>

      <div className="flex flex-col gap-3">
        <BarkButton
          className="w-full md:w-32"
          variant="brand"
          href={RoutePath.USER_MY_ACCOUNT_EDIT}
        >
          Edit
        </BarkButton>
      </div>
    </main>
  );
}
