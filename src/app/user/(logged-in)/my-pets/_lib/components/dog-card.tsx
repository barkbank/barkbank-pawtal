"use client";

import { BarkDogAvatar } from "@/components/bark/bark-dog-avatar";
import { BarkStatusBlock } from "@/components/bark/bark-status-block";
import { RoutePath } from "@/lib/route-path";
import { MyDog } from "@/lib/user/user-models";
import { useRouter } from "next/navigation";

export function DogCard(props: {
  dog: MyDog;
  cardIdx: number;
  isLastCard: boolean;
}) {
  const { dog } = props;
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
        <div className="flex-1">
          <div className="text-grey-100 text-lg font-semibold leading-9">
            {dog.dogName}
          </div>
          <BarkStatusBlock
            dogName={dogName}
            dogStatuses={dogStatuses}
            dogAppointments={dogAppointments}
          />
        </div>
      </div>
    </>
  );
}
