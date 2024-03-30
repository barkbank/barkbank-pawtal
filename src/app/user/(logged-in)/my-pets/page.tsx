"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { handleUserGetMyPets } from "@/lib/handlers/handle-user-get-my-pets";
import APP from "@/lib/app";
import { MyDog } from "@/lib/models/user-models";
import Image from "next/image";
import { IMG_PATH } from "@/lib/image-path";
import {
  DogGender,
  MEDICAL_STATUS,
  PARTICIPATION_STATUS,
  PROFILE_STATUS,
  SCHEDULING_STATUS,
  SERVICE_STATUS,
} from "@/lib/data/db-enums";
import {
  BarkStatusAwaitingReport,
  BarkStatusEligible,
  BarkStatusIneligible,
  BarkStatusParticipationOptedOut,
  BarkStatusParticipationPaused,
  BarkStatusProfileIncomplete,
  BarkStatusServiceUnavailable,
  BarkStatusTemporarilyIneligible,
} from "@/components/bark/bark-status";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
  StatusSet,
  mapStatusSetToHighlightedStatus,
} from "@/lib/data/status-mapper";

function toStatusSet(dog: MyDog): StatusSet {
  const statusSet: StatusSet = {
    serviceStatus: dog.dogServiceStatus,
    profileStatus: dog.dogProfileStatus,
    medicalStatus: dog.dogMedicalStatus,
    numPendingReports: dog.dogAppointments.length,
    // TODO: once we have pause and opt-out we should update this.
    participationStatus: PARTICIPATION_STATUS.PARTICIPATING,
  };
  return statusSet;
}

function StatusMessage(props: {
  children: React.ReactNode;
  variant?: "red-italic";
}) {
  const { children, variant } = props;
  return (
    <div
      className={clsx("mt-2 text-sm leading-5", {
        "italic text-[#DC362E]": variant === "red-italic",
      })}
    >
      {children}
    </div>
  );
}

function StatusBlock(props: { dog: MyDog }) {
  const { dog } = props;
  const statusSet = toStatusSet(dog);
  const highlightedStatus = mapStatusSetToHighlightedStatus(statusSet);
  const { dogName, dogAppointments } = dog;

  if (highlightedStatus === SERVICE_STATUS.UNAVAILABLE) {
    return (
      <div>
        <BarkStatusServiceUnavailable />
        <StatusMessage>
          Sorry, Bark Bank services are not available in your region. Thank you
          for your support!
        </StatusMessage>
      </div>
    );
  }
  if (highlightedStatus === SCHEDULING_STATUS.PENDING_REPORT) {
    if (dogAppointments.length === 1) {
      const { vetName } = dogAppointments[0];
      return (
        <div>
          <BarkStatusAwaitingReport />
          <StatusMessage>
            A veterinary appointment for {dogName} with {vetName} is on record.
          </StatusMessage>
        </div>
      );
    } else {
      return (
        <div>
          <BarkStatusAwaitingReport />
          <StatusMessage>
            <p>{dogName} has appointments with the following vets:</p>
            <ul>
              {dogAppointments.map((appointment) => (
                <li key={appointment.vetId} className="list-inside list-disc">
                  {appointment.vetName}
                </li>
              ))}
            </ul>
          </StatusMessage>
        </div>
      );
    }
  }
  if (highlightedStatus === PARTICIPATION_STATUS.OPTED_OUT) {
    return (
      <div>
        <BarkStatusParticipationOptedOut />
        <StatusMessage>
          {dogName} is not participating in the Bark Bank programme.
        </StatusMessage>
      </div>
    );
  }
  if (highlightedStatus === PARTICIPATION_STATUS.PAUSED) {
    return (
      <div>
        <BarkStatusParticipationPaused />
        <StatusMessage>
          Your dog&apos;s participation in the Bark Bank programme is currently
          paused.
        </StatusMessage>
      </div>
    );
  }
  if (highlightedStatus === MEDICAL_STATUS.PERMANENTLY_INELIGIBLE) {
    return (
      <div>
        <BarkStatusIneligible />
        <StatusMessage>
          {dogName} does not meet the necessary criteria for blood donation.
          Thank you for your interest!
        </StatusMessage>
      </div>
    );
  }
  if (highlightedStatus === PROFILE_STATUS.INCOMPLETE) {
    return (
      <div>
        <BarkStatusProfileIncomplete />
        <StatusMessage variant="red-italic">
          Please complete your dog&apos;s profile to enable donation eligibility
          assessment.
        </StatusMessage>
      </div>
    );
  }
  if (highlightedStatus === MEDICAL_STATUS.TEMPORARILY_INELIGIBLE) {
    return (
      <div>
        <BarkStatusTemporarilyIneligible />
        <StatusMessage>
          {dogName} does not meet the necessary criteria for blood donation.
        </StatusMessage>
      </div>
    );
  }
  if (highlightedStatus === MEDICAL_STATUS.ELIGIBLE) {
    return (
      <div>
        <BarkStatusEligible />
        <StatusMessage>
          {dogName} is eligible for blood donation. Your preferred vet will
          reachout to make an appointment.
        </StatusMessage>
      </div>
    );
  }
  // Logically it should not be possible to get to this part. However, if it
  // does, we will mention that the status is eligible, but we will not mention
  // vet appointments.
  console.log(
    `unexpected dog status. StatusSet = ${JSON.stringify(statusSet)} HighlightedStatus = ${highlightedStatus}`,
  );
  return (
    <div>
      <BarkStatusEligible />
      <StatusMessage>{dogName} is eligible for blood donation.</StatusMessage>
    </div>
  );
}

function ActionBlock(props: { dog: MyDog }) {
  const { dog } = props;
  const highlightedStatus = mapStatusSetToHighlightedStatus(toStatusSet(dog));
  if (highlightedStatus === PROFILE_STATUS.INCOMPLETE) {
    return (
      <div className="flex flex-row gap-3">
        <Button variant="brand">Complete Profile</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-row gap-3">
      <Button variant="brandInverse">Edit</Button>
      <Button variant="brandInverse">View</Button>
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
        {/* Left Side Avatar */}
        <Image
          src={imgSrc}
          alt="Generic dog avatar for dog details"
          width={100}
          height={100}
        />

        {/* Right Side Details */}
        <div>
          {/* Dog Name across the details */}
          <div className="text-grey-100 text-lg font-bold leading-9">
            {dog.dogName}
          </div>

          {/* Details and Buttons below */}
          <div className="mt-2 flex flex-row gap-5">
            <div className="w-96">
              <StatusBlock dog={dog} />
            </div>
            <div>
              <ActionBlock dog={dog} />
            </div>
          </div>
        </div>
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
      <Button className="w-full" variant="brandInverse">
        Add Pet
      </Button>
    </>
  );
}
