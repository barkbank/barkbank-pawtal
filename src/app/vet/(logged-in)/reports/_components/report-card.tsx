import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { DOG_GENDER, SpecifiedDogGender } from "@/lib/bark/models/dog-gender";
import { POS_NEG_NIL, PosNegNil } from "@/lib/data/db-enums";
import { IMG_PATH } from "@/lib/image-path";
import clsx from "clsx";
import { capitalize } from "lodash";
import { CircleHelp, Droplets, Minus, Plus, Worm } from "lucide-react";
import Image from "next/image";

export function ReportCard(props: { report: BarkReport }) {
  const { report } = props;
  const {
    dogName,
    ownerName,
    dogBreed,
    dogGender,
    dogBodyConditioningScore,
    dogHeartworm,
    dogDea1Point1,
    dogDidDonateBlood,
    dogWeightKg,
  } = report;
  const avatar = getAvatar(dogGender);
  return (
    <div className="x-rounded-card flex flex-col items-start justify-between gap-3">
      <div className="flex w-full flex-row items-center justify-between gap-3">
        {avatar}
        <h2 className="x-typography-card-header flex-1">{dogName}</h2>
        {getDonated(dogDidDonateBlood)}
      </div>
      <p className="flex-1">
        <span className="font-semibold text-teal-600">{dogName}</span> is a{" "}
        <span className="font-semibold text-amber-600">{dogWeightKg}kg</span>{" "}
        <span className="font-semibold text-cyan-600">
          {capitalize(dogGender)}
        </span>{" "}
        <span className="font-semibold text-orange-700">{dogBreed}</span>{" "}
        belonging to{" "}
        <span className="font-semibold text-purple-700">{ownerName}</span>.
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
    return <Badge className="bg-teal-600 text-xs">DEA1.1 +</Badge>;
  }
  if (dogDea1Point1 === POS_NEG_NIL.NEGATIVE) {
    return <Badge className="bg-amber-600 text-xs">DEA1.1 -</Badge>;
  }
  return <Badge className="bg-slate-300">DEA1.1 ?</Badge>;
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
