import { SCHEDULING_STATUS } from "@/lib/bark/enums/scheduling-status";
import { PARTICIPATION_STATUS } from "@/lib/bark/enums/participation-status";
import { MEDICAL_STATUS } from "@/lib/bark/enums/medical-status";
import { PROFILE_STATUS } from "@/lib/bark/enums/profile-status";
import { SERVICE_STATUS } from "@/lib/bark/enums/service-status";
import { toHighlightedStatus } from "@/lib/bark/mappers/to-highlighted-status";
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
import { DogAppointment } from "@/lib/bark/models/dog-appointment";
import { DogStatuses } from "@/lib/bark/models/dog-statuses";
import { LocateIcon, MapPin, Phone, Pin } from "lucide-react";

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
  const highlightedStatus = toHighlightedStatus(dogStatuses);

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
    const headLine =
      dogAppointments.length === 1 ? (
        <p>A veterinary appointment for {dogName} is on record.</p>
      ) : (
        <p>{dogName} has appointments with the following vets:</p>
      );
    return (
      <div>
        <BarkStatusAwaitingReport />
        <StatusMessage>
          <div className="flex flex-col gap-1">
            {headLine}
            {dogAppointments.map(
              ({ vetName, vetPhoneNumber, vetAddress }, idx) => (
                <div key={idx} className="x-card bg-gray-100">
                  <p>Clinic: {vetName}</p>
                  <p>Phone: {vetPhoneNumber}</p>
                  <p>Address: {vetAddress}</p>
                </div>
              ),
            )}
          </div>
        </StatusMessage>
      </div>
    );
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
