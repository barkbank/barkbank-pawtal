"use server";

import { BarkH1 } from "@/components/bark/bark-typography";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { handleUserGetMyPets } from "@/lib/handlers/handle-user-get-my-pets";
import APP from "@/lib/app";
import { MyDog } from "@/lib/models/user-models";
import Image from "next/image";
import { IMG_PATH } from "@/lib/image-path";
import { DogGender, MEDICAL_STATUS, PROFILE_STATUS } from "@/lib/data/db-enums";
import {
  BarkStatusEligible,
  BarkStatusIneligible,
  BarkStatusProfileIncomplete,
  BarkStatusTemporarilyIneligible,
} from "@/components/bark/bark-status";
import clsx from "clsx";

function StatusBlock(props: { dog: MyDog }) {
  const { dog } = props;
  const typographyClasses = "leading-5 text-sm mt-2";
  if (dog.dogMedicalStatus === MEDICAL_STATUS.PERMANENTLY_INELIGIBLE) {
    return (
      <div className="mt-2">
        <BarkStatusIneligible />
        <div className={clsx(typographyClasses)}>
          {dog.dogName} does not meet the necessary criteria for blood donation.
          Thank you for your interest!
        </div>
      </div>
    );
  }
  if (dog.dogProfileStatus === PROFILE_STATUS.INCOMPLETE) {
    return (
      <div>
        <BarkStatusProfileIncomplete />
        <div className={clsx(typographyClasses, "italic text-[#DC362E]")}>
          Please complete your dog's profile to enable donation eligibility
          assessmenet.
        </div>
      </div>
    );
  }
  if (dog.dogMedicalStatus === MEDICAL_STATUS.TEMPORARILY_INELIGIBLE) {
    return (
      <div>
        <BarkStatusTemporarilyIneligible />
        <div className={clsx(typographyClasses)}>
          {dog.dogName} does not meet the necessary criteria for blood donation.
        </div>
      </div>
    );
  }
  if (dog.dogMedicalStatus === MEDICAL_STATUS.ELIGIBLE) {
    return (
      <div>
        <BarkStatusEligible />
        <div className={clsx(typographyClasses)}>
          {dog.dogName} is eligible for blood donation.
        </div>
      </div>
    );
  }
  return (
    <div>
      <BarkStatusEligible />
      <div className={clsx(typographyClasses)}>
        {dog.dogName} is eligible for blood donation. Perhaps.
      </div>
    </div>
  );
}

function DogCard(props: { dog: MyDog; cardIdx: number; isLastCard: boolean }) {
  const { dog, cardIdx, isLastCard } = props;
  const imgSrc =
    dog.dogGender === DogGender.MALE
      ? IMG_PATH.BROWN_DOG_AVATAR
      : IMG_PATH.BORDER_COLLIE_DOG_AVATAR;
  return (
    <>
      <div
        className={clsx(
          "mx-5 mt-[40px] flex flex-row gap-5 px-[40px] pb-[40px]",
          {
            "border-b border-solid border-[#A5A4A6]": !isLastCard,
          },
        )}
      >
        <Image
          src={imgSrc}
          alt="Generic dog avatar for dog details"
          width={100}
          height={100}
        />
        <div className="w-96">
          <div className="text-grey-100 text-lg font-bold leading-9">
            {dog.dogName}
          </div>
          <div>
            <StatusBlock dog={dog} />
          </div>
        </div>
        <div>Buttons</div>
      </div>
    </>
  );
}

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const dogs = await handleUserGetMyPets({
    userId: actor.getUserId(),
    dbPool: await APP.getDbPool(),
    dogMapper: await APP.getDogMapper(),
  });
  return (
    <>
      <div>
        {dogs.map((dog, idx, ary) => (
          <DogCard
            key={dog.dogId}
            dog={dog}
            cardIdx={idx}
            isLastCard={idx === ary.length - 1}
          />
        ))}
      </div>
      <div>WIP: Add Pet Button</div>
    </>
  );
}
