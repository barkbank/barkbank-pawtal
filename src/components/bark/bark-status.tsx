import { IMG_PATH } from "@/lib/image-path";
import clsx from "clsx";
import Image from "next/image";

function GenericStatus(props: {
  imgSrc: string;
  imgAlt: string;
  statusLabel: string;
  statusColor: string;
}) {
  const { imgSrc, imgAlt, statusLabel, statusColor } = props;
  return (
    <div className="flex flex-row items-center gap-3">
      <Image src={imgSrc} alt={imgAlt} width={30} height={30} />
      <div className={clsx("text-base font-bold leading-4", statusColor)}>
        {statusLabel}
      </div>
    </div>
  );
}

export function BarkStatusProfileIncomplete() {
  return (
    <GenericStatus
      imgSrc={IMG_PATH.CIRCLE_RED_EXCLAMATION}
      imgAlt="Icon indicating an incomplete profile"
      statusLabel="Profile Incomplete"
      statusColor="text-[#DC362E]"
    />
  );
}

export function BarkStatusEligible() {
  return (
    <GenericStatus
      imgSrc={IMG_PATH.CIRCLE_GREEN_TICK}
      imgAlt="Icon indicating an eligible status"
      statusLabel="Eligible"
      statusColor="text-[#09BC91]"
    />
  );
}

export function BarkStatusTemporarilyIneligible() {
  return (
    <GenericStatus
      imgSrc={IMG_PATH.CIRCLE_BLUE_PAUSE}
      imgAlt="Icon indicating temporary ineligibility"
      statusLabel="Temporarily Ineligible"
      statusColor="text-[#3798F0]"
    />
  );
}

export function BarkStatusIneligible() {
  return (
    <GenericStatus
      imgSrc={IMG_PATH.CIRCLE_GREY_CROSS}
      imgAlt="Icon indicating ineligible"
      statusLabel="Ineligible"
      statusColor="text-[#777679]"
    />
  );
}

export function BarkStatusEligibilityAssessmentUnderway() {
  return (
    <GenericStatus
      imgSrc={IMG_PATH.CIRCLE_GREY_CROSS}
      imgAlt="Icon indicating on-going eligibility assessmenet"
      statusLabel="Eligibility Assessment Underway"
      statusColor="text-[#FFBE5C]"
    />
  );
}
