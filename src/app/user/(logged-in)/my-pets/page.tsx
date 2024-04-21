"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { getMyPets } from "@/lib/user/actions/get-my-pets";
import { MyDog } from "@/lib/user/user-models";
import Image from "next/image";
import { IMG_PATH } from "@/lib/image-path";
import {
  DOG_GENDER,
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
import {
  StatusSet,
  mapStatusSetToHighlightedStatus,
} from "@/lib/data/status-mapper";
import { BarkButton } from "@/components/bark/bark-button";

function toStatusSet(dog: MyDog): StatusSet {
  const statusSet: StatusSet = {
    serviceStatus: dog.dogServiceStatus,
    profileStatus: dog.dogProfileStatus,
    medicalStatus: dog.dogMedicalStatus,
    numPendingReports: dog.dogAppointments.length,
    participationStatus: dog.dogParticipationStatus,
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
      <BarkButton variant="brand" className="w-full">
        Complete Profile
      </BarkButton>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <BarkButton variant="brandInverse" className="w-full">
        Edit
      </BarkButton>
      <BarkButton variant="brandInverse" className="w-full">
        View
      </BarkButton>
    </div>
  );
}

function DogCard(props: { dog: MyDog; cardIdx: number; isLastCard: boolean }) {
  const { dog, cardIdx, isLastCard } = props;
  const imgSrc =
    dog.dogGender === DOG_GENDER.MALE
      ? IMG_PATH.BROWN_DOG_AVATAR
      : IMG_PATH.BORDER_COLLIE_DOG_AVATAR;
  return (
    <>
      <div className="mt-3 flex flex-col place-items-center gap-3 rounded-md px-3 py-3 shadow-sm shadow-slate-400 first:mt-0 md:flex-row">
        {/* Avatar */}
        <Image
          src={imgSrc}
          alt="Generic dog avatar for dog details"
          width={100}
          height={100}
          className=""
        />

        {/* Details */}
        <div className="flex-1">
          <div className="text-grey-100 text-lg font-semibold leading-9">
            {dog.dogName}
          </div>
          <StatusBlock dog={dog} />
        </div>

        {/* Buttons */}
        <div className="w-full md:w-48">
          <ActionBlock dog={dog} />
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
  const dogs = await getMyPets(actor);
  return (
    <div className="m-3">
      {dogs.map((dog, idx, ary) => (
        <DogCard
          key={dog.dogId}
          dog={dog}
          cardIdx={idx}
          isLastCard={idx === ary.length - 1}
        />
      ))}
      <BarkButton
        className="mt-3 w-full"
        variant="brandInverse"
        href={RoutePath.USER_ADD_DOG}
      >
        Add Pet
      </BarkButton>
    </div>
  );
}
