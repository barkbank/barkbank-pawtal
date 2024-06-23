import { UserResidency } from "@/lib/bark/enums/user-residency";
import { IMG_PATH } from "@/lib/image-path";
import { capitalize } from "lodash";
import Image from "next/image";
import { BarkH4 } from "./bark-typography";
import { SINGAPORE_TIME_ZONE, formatDateTime } from "@/lib/utilities/bark-time";
import { formatDistanceStrict } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { NA_TEXT } from "@/app/_lib/constants";
import { Input } from "../ui/input";

export function BarkUserContactDetails(props: {
  details: null | {
    userName: string;
    userEmail?: string;
    userPhoneNumber: string;
    userResidency: UserResidency;
    userCreationTime?: Date;
    userLastContactedTime?: Date;
  };
}) {
  const { details } = props;

  // Show a skeleton when details are not defined.
  if (details === null) {
    return (
      <div className="flex max-w-64 flex-col gap-2">
        <Skeleton className="h-8 w-2/5" />
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-4/5" />
      </div>
    );
  }

  const {
    userName,
    userEmail,
    userPhoneNumber,
    userResidency,
    userCreationTime,
    userLastContactedTime,
  } = details;

  const userCreationTimeText =
    userCreationTime === undefined
      ? undefined
      : formatDateTime(userCreationTime, {
          format: "dd MMM yyyy",
          timeZone: SINGAPORE_TIME_ZONE,
        });

  const latestCallText =
    userLastContactedTime === undefined
      ? undefined
      : formatDistanceStrict(userLastContactedTime, new Date(), {
          addSuffix: true,
        });

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-[7px] flex flex-col gap-[7px]">
        <BarkH4>{userName}</BarkH4>
        {userCreationTimeText !== undefined && (
          <p className="text-xs italic text-grey-60">
            Account created on: {userCreationTimeText}
          </p>
        )}
        <p className="text-xs italic text-grey-60">
          Last contacted:{" "}
          {latestCallText !== undefined ? latestCallText : NA_TEXT}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <_ContactItem
          icon={_locationIcon()}
          value={capitalize(userResidency)}
        />
        {userEmail && <_ContactItem icon={_emailIcon()} value={userEmail} />}
        <_ContactItem icon={_phoneIcon()} value={userPhoneNumber} />
      </div>
    </div>
  );
}

function _ContactItem(props: { icon: React.ReactNode; value: string }) {
  const { icon, value } = props;
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex h-[25px] w-[25px] flex-row place-content-center justify-items-center">
        {icon}
      </div>
      <Input disabled={true} value={value} className="w-full" />
    </div>
  );
}

function _phoneIcon() {
  return (
    <Image
      src={IMG_PATH.PHONE}
      width={30}
      height={30}
      alt="phone icon"
      className="h-full w-auto"
    />
  );
}

function _emailIcon() {
  return (
    <Image
      src={IMG_PATH.LETTER}
      width={26}
      height={20}
      alt="letter icon"
      className="h-auto w-full"
    />
  );
}

function _locationIcon() {
  return (
    <Image
      src={IMG_PATH.LOCATION_MARKER}
      width={24}
      height={26}
      alt="location marker icon"
      className="h-full w-auto"
    />
  );
}
