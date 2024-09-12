"use client";

import { Badge } from "@/components/ui/badge";
import { BarkReport } from "@/lib/bark/models/report-models";
import {
  REPORTED_INELIGIBILITY,
  ReportedIneligibility,
} from "@/lib/bark/enums/reported-ineligibility";
import { POS_NEG_NIL, PosNegNil } from "@/lib/bark/enums/pos-neg-nil";
import { RoutePath } from "@/lib/route-path";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";
import clsx from "clsx";
import { capitalize } from "lodash";
import { Droplets, Worm } from "lucide-react";
import { useRouter } from "next/navigation";
import { sprintf } from "sprintf-js";
import { DogAvatar } from "./dog-avatar";

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
  const gotoViewReport = () => {
    router.push(RoutePath.VET_REPORTS_VIEW(reportId));
  };
  return (
    <div
      className="x-card x-card-bg flex cursor-pointer flex-col items-start justify-between gap-3"
      onClick={gotoViewReport}
    >
      <div className="flex w-full flex-row items-center justify-between gap-3">
        <DogAvatar dogGender={dogGender} />
        <h2 className="x-card-title flex-1">{dogName}</h2>
        {getDonated(dogDidDonateBlood)}
      </div>
      <p>Visited on {formatDateTime(visitTime, SGT_UI_DATE)}</p>
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
      <div className="flex flex-wrap gap-3">
        {getHeartworm(dogHeartworm)}
        {getBCS(dogBodyConditioningScore)}
        {getBloodType(dogDea1Point1)}
        {getReportedIneligibility(ineligibilityStatus)}
      </div>
    </div>
  );
}

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
    return <Badge className="bg-amber-600">Temporarily Ineligible</Badge>;
  }
  if (reportedIneligibility === REPORTED_INELIGIBILITY.PERMANENTLY_INELIGIBLE) {
    return <Badge className="bg-red-600">Permanently Ineligible</Badge>;
  }
};
