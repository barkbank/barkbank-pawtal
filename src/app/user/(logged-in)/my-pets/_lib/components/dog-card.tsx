"use client";

import { BarkDogAvatar } from "@/components/bark/bark-dog-avatar";
import { BarkStatusBlock } from "@/components/bark/bark-status-block";
import { IneligibilityReason } from "@/lib/bark/enums/ineligibility-reason";
import { RoutePath } from "@/lib/route-path";
import { MyDog } from "@/lib/user/user-models";
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
  // WIP: Render ineligibility reasons
  return (
    <>
      <div
        onClick={gotoViewDog}
        className="x-card x-card-bg flex cursor-pointer flex-col place-items-center gap-3 md:flex-row"
      >
        {/* Avatar */}
        <BarkDogAvatar gender={dog.dogGender} />

        {/* Details */}
        <div className="w-full flex-1">
          <div className="text-grey-100 text-lg font-semibold leading-9">
            {dog.dogName}
          </div>
          <BarkStatusBlock
            dogName={dogName}
            dogStatuses={dogStatuses}
            dogAppointments={dogAppointments}
          />
          <pre>{JSON.stringify(ineligibilityReasons, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
