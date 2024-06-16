"use client";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkDogAvatar } from "@/components/bark/bark-dog-avatar";
import { BarkStatusBlock } from "@/components/bark/bark-status-block";
import { PROFILE_STATUS } from "@/lib/data/db-enums";
import { getHighlightedStatus } from "@/lib/dog/get-highlighted-status";
import { RoutePath } from "@/lib/route-path";
import { MyDog } from "@/lib/user/user-models";
import { useRouter } from "next/navigation";

function ActionBlock(props: { dog: MyDog }) {
  const { dog } = props;
  const { dogId } = dog;
  const highlightedStatus = getHighlightedStatus(dog.dogStatuses);
  if (highlightedStatus === PROFILE_STATUS.INCOMPLETE) {
    return (
      <BarkButton
        variant="brand"
        className="w-full"
        href={RoutePath.USER_EDIT_DOG(dogId)}
      >
        Complete Profile
      </BarkButton>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <BarkButton
        variant="brandInverse"
        className="w-full"
        href={RoutePath.USER_EDIT_DOG(dogId)}
      >
        Edit
      </BarkButton>
      <BarkButton
        variant="brandInverse"
        className="w-full"
        href={RoutePath.USER_VIEW_DOG(dogId)}
      >
        View
      </BarkButton>
    </div>
  );
}

export function DogCard(props: {
  dog: MyDog;
  cardIdx: number;
  isLastCard: boolean;
}) {
  const { dog } = props;
  const { dogId, dogName, dogStatuses, dogAppointments } = dog;
  const router = useRouter();
  const onClick = () => {
    router.push(RoutePath.USER_VIEW_DOG(dogId));
  };
  return (
    <>
      <div
        onClick={onClick}
        className="mt-3 flex flex-col place-items-center gap-3 rounded-md px-3 py-3 shadow-sm shadow-slate-400 first:mt-0 md:flex-row"
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

        {/* Buttons */}
        <div className="w-full md:w-48">
          <ActionBlock dog={dog} />
        </div>
      </div>
    </>
  );
}
