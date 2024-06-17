import {
  SCHEDULING_STATUS,
  PARTICIPATION_STATUS,
  MEDICAL_STATUS,
} from "@/lib/data/db-enums";
import { PROFILE_STATUS } from "@/lib/bark/enums/profile-status";
import { SERVICE_STATUS } from "@/lib/bark/enums/service-status";
import { getHighlightedStatus } from "@/lib/dog/get-highlighted-status";
import clsx from "clsx";
import {
  BarkStatusServiceUnavailable,
  BarkStatusAwaitingReport,
  BarkStatusParticipationOptedOut,
  BarkStatusParticipationPaused,
  BarkStatusIneligible,
  BarkStatusProfileIncomplete,
  BarkStatusTemporarilyIneligible,
  BarkStatusEligible,
} from "./bark-status";
import { DogAppointment, DogStatuses } from "@/lib/dog/dog-models";

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

export function BarkStatusBlock(props: {
  dogName: string;
  dogStatuses: DogStatuses;
  dogAppointments: DogAppointment[];
}) {
  const { dogName, dogAppointments, dogStatuses } = props;
  const highlightedStatus = getHighlightedStatus(dogStatuses);

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
  console.warn("unexpected dog status", { dogStatuses, highlightedStatus });
  return (
    <div>
      <BarkStatusEligible />
      <StatusMessage>{dogName} is eligible for blood donation.</StatusMessage>
    </div>
  );
}
