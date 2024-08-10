"use client";

import { BarkDogAvatar } from "@/components/bark/bark-dog-avatar";
import { BarkStatusBlock } from "@/components/bark/bark-status-block";
import {
  INELIGIBILITY_REASON,
  IneligibilityReason,
} from "@/lib/bark/enums/ineligibility-reason";
import { MyDog } from "@/lib/bark/models/user-models";
import { RoutePath } from "@/lib/route-path";
import { useRouter } from "next/navigation";

export type DogCardData = {
  dog: MyDog;
  ineligibilityReasons: IneligibilityReason[];
};

export function DogCard(props: {
  data: DogCardData;
  cardIdx: number;
  isLastCard: boolean;
}) {
  const { data } = props;
  const { dog, ineligibilityReasons } = data;
  const { dogId, dogName, dogStatuses, dogAppointments } = dog;
  const router = useRouter();
  const gotoViewDog = () => {
    router.push(RoutePath.USER_VIEW_DOG(dogId));
  };
  return (
    <>
      <div
        onClick={gotoViewDog}
        className="x-card x-card-bg flex cursor-pointer flex-col place-items-center gap-3 md:flex-row"
      >
        {/* Avatar */}
        <BarkDogAvatar gender={dog.dogGender} />

        {/* Details */}
        <div className="flex w-full flex-1 flex-col gap-1">
          <div className="text-grey-100 text-lg font-semibold leading-9">
            {dog.dogName}
          </div>
          <BarkStatusBlock
            dogName={dogName}
            dogStatuses={dogStatuses}
            dogAppointments={dogAppointments}
          />
          {ineligibilityReasons.length > 0 && (
            <_Reasons ineligibilityReasons={ineligibilityReasons} />
          )}
        </div>
      </div>
    </>
  );
}

function _Reasons(props: { ineligibilityReasons: IneligibilityReason[] }) {
  const { ineligibilityReasons } = props;
  return (
    <div className="text-sm italic text-slate-600">
      <p>
        Ineligibility Reasons:
        {ineligibilityReasons.map((reason, idx) => {
          const isLast = idx === ineligibilityReasons.length - 1;
          const suffix = isLast ? "." : ";";
          return (
            <span key={idx}>
              {" "}
              ({idx + 1}) {_toText(reason)}
              {suffix}
            </span>
          );
        })}
      </p>
    </div>
  );
}

function _toText(reason: IneligibilityReason): string {
  return {
    [INELIGIBILITY_REASON.UNDER_ONE_YEAR_OLD]: "Underage",
    [INELIGIBILITY_REASON.EIGHT_YEARS_OR_OLDER]: "Overage",
    [INELIGIBILITY_REASON.UNDER_20_KGS]: "Underweight",
    [INELIGIBILITY_REASON.EVER_PREGNANT]: "Ever pregnant",
    [INELIGIBILITY_REASON.EVER_RECEIVED_BLOOD]:
      "Ever received blood transfusion",
    [INELIGIBILITY_REASON.HEARTWORM_IN_LAST_6_MONTHS]:
      "Tested positive for heartworms within the last 180 days",
    [INELIGIBILITY_REASON.DONATED_IN_LAST_3_MONTHS]:
      "Donated blood within the last 90 days",
    [INELIGIBILITY_REASON.REPORTED_BY_VET]: "Reported by vet",
  }[reason];
}
