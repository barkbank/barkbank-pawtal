"use client";

import {
  BarkStatusEligible,
  BarkStatusIneligible,
  BarkStatusTemporarilyIneligible,
} from "@/components/bark/bark-status";
import { Badge } from "@/components/ui/badge";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { DOG_GENDER, SpecifiedDogGender } from "@/lib/bark/models/dog-gender";
import {
  POS_NEG_NIL,
  PosNegNil,
  REPORTED_INELIGIBILITY,
  ReportedIneligibility,
} from "@/lib/data/db-enums";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { SINGAPORE_TIME_ZONE, formatDateTime } from "@/lib/utilities/bark-time";
import clsx from "clsx";
import { capitalize } from "lodash";
import { Droplets, Edit, Worm } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sprintf } from "sprintf-js";

export function ReportCard(props: { report: BarkReport }) {
  const router = useRouter();
  const { report } = props;
  const {
    reportId,
    visitTime,
    dogName,
    ownerName,
    dogBreed,
    dogGender,
    dogBodyConditioningScore,
    dogHeartworm,
    dogDea1Point1,
    dogDidDonateBlood,
    dogWeightKg,
    ineligibilityStatus,
  } = report;
  const avatar = getAvatar(dogGender);
  const gotoViewReport = () => {
    router.push(RoutePath.VET_REPORTS_VIEW(reportId));
  };
  return (
    <div
      className="x-rounded-card flex flex-col items-start justify-between gap-3 hover:bg-slate-100"
      onClick={gotoViewReport}
    >
      <div className="flex w-full flex-row items-center justify-between gap-3">
        {avatar}
        <h2 className="x-typography-card-header flex-1">{dogName}</h2>
        {getDonated(dogDidDonateBlood)}
        <Link href={RoutePath.VET_REPORTS_EDIT(reportId)}>
          <Edit />
        </Link>
      </div>
      {getReportedIneligibility(ineligibilityStatus)}
      <p className="flex-1">
        Visit date:{" "}
        <span className="font-semibold">{toDateText(visitTime)}</span>
      </p>
      <p className="flex-1">
        <span className="font-semibold text-slate-700">{dogName}</span> is a{" "}
        <span className="font-semibold text-slate-500">
          {sprintf("%.0f", dogWeightKg)}kg
        </span>{" "}
        <span className="font-semibold text-slate-700">
          {capitalize(dogGender)}
        </span>{" "}
        <span className="font-semibold text-slate-500">{dogBreed}</span>{" "}
        belonging to{" "}
        <span className="font-semibold text-slate-700">{ownerName}</span>.
      </p>
      <div className="flex h-[24px] flex-row gap-3">
        {getHeartworm(dogHeartworm)}
        {getBCS(dogBodyConditioningScore)}
        {getBloodType(dogDea1Point1)}
      </div>
    </div>
  );
}

const getAvatar = (dogGender: SpecifiedDogGender) => {
  const size = 24;
  if (dogGender === DOG_GENDER.MALE) {
    return (
      <Image
        src={IMG_PATH.BROWN_DOG_AVATAR}
        width={size}
        height={size}
        alt="Generic male dog avatar"
      />
    );
  }
  return (
    <Image
      src={IMG_PATH.BORDER_COLLIE_DOG_AVATAR}
      width={size}
      height={size}
      alt="Generic female dog avatar"
    />
  );
};

const toDateText = (visitTime: Date) => {
  return formatDateTime(visitTime, {
    timeZone: SINGAPORE_TIME_ZONE,
    format: "d MMMM yyyy",
  });
};

const getHeartworm = (dogHeartworm: PosNegNil) => {
  if (dogHeartworm === POS_NEG_NIL.POSITIVE) {
    return (
      <Badge className="bg-red-600">
        <Worm color="#fff" height={16} />
      </Badge>
    );
  }
  if (dogHeartworm === POS_NEG_NIL.NEGATIVE) {
    return (
      <Badge className="bg-green-600">
        <Worm color="#fff" height={16} />
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-300">
      <Worm color="#fff" height={16} />
    </Badge>
  );
};

const getBloodType = (dogDea1Point1: PosNegNil) => {
  if (dogDea1Point1 === POS_NEG_NIL.POSITIVE) {
    return <Badge className="bg-blue-700 text-xs">DEA1.1 Positive</Badge>;
  }
  if (dogDea1Point1 === POS_NEG_NIL.NEGATIVE) {
    return <Badge className="bg-blue-500 text-xs">DEA1.1 Negative</Badge>;
  }
  return <Badge className="bg-slate-300">No Blood Test</Badge>;
};

const getBCS = (dogBodyConditioningScore: number) => {
  return (
    <Badge
      className={clsx({
        "bg-yellow-600": [1, 2, 3].includes(dogBodyConditioningScore),
        "bg-green-600": [4, 5].includes(dogBodyConditioningScore),
        "bg-amber-600": [6].includes(dogBodyConditioningScore),
        "bg-red-600": [7, 8, 9].includes(dogBodyConditioningScore),
      })}
    >
      BCS {dogBodyConditioningScore}
    </Badge>
  );
};

const getDonated = (dogDidDonateBlood: boolean) => {
  if (dogDidDonateBlood) {
    return (
      <Badge className="bg-green-600 text-xs">
        <Droplets height={16} />
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-300 text-xs">
      <Droplets height={16} />
    </Badge>
  );
};

const getReportedIneligibility = (
  reportedIneligibility: ReportedIneligibility,
) => {
  if (reportedIneligibility === REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE) {
    return <BarkStatusTemporarilyIneligible />;
  }
  if (reportedIneligibility === REPORTED_INELIGIBILITY.PERMANENTLY_INELIGIBLE) {
    return <BarkStatusIneligible />;
  }
  return <BarkStatusEligible />;
};
