import { BarkButton } from "@/components/bark/bark-button";
import { useOwnerContactDetails } from "../_lib/use-owner-contact-details";
import { BarkUserContactDetails } from "@/components/bark/bark-user-contact-details";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CALL_OUTCOME, USER_RESIDENCY } from "@/lib/data/db-enums";
import { SchedulerOutcome } from "../_lib/scheduler-models";
import { DeclinedBadge, ScheduledBadge } from "./scheduler-badges";
import { postSchedulerOutcome } from "../_actions/post-scheduler-outcome";
import { CODE } from "@/lib/utilities/bark-code";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";

/**
 * This is the call card for capturing call outcomes
 */
export function CallCard(props: {
  dogId: string;
  outcome: SchedulerOutcome | undefined;
  onScheduled: () => void;
  onDeclined: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { dogId, outcome, onScheduled, onDeclined } = props;
  const { data } = useOwnerContactDetails(dogId);
  if (data === undefined) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <BarkUserContactDetails details={null} />
        <Skeleton className="h-12 w-3/5" />
        <Skeleton className="h-12 w-3/5" />
      </div>
    );
  }
  const { userName, userEmail, userPhoneNumber, vetUserLastContactedTime } =
    data;

  // TODO: (Maybe) Add userResidency to OwnerContactDetails. For now, hardcoding
  // is safe because all available dogs have owners residing in Singapore.
  const userResidency = USER_RESIDENCY.SINGAPORE;

  const userLastContactedTime = vetUserLastContactedTime ?? undefined;

  async function submitOutcome(selectedOutcome: SchedulerOutcome) {
    const res = await postSchedulerOutcome({
      dogId,
      callOutcome: selectedOutcome,
    });
    if (res === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.VET_LOGIN_PAGE);
    }
    if (res !== CODE.OK) {
      toast({
        title: "Error",
        description: `Code: ${res}`,
        variant: "brandError",
      });
    }
    if (res === CODE.OK) {
      if (selectedOutcome === CALL_OUTCOME.APPOINTMENT) {
        onScheduled();
      }
      if (selectedOutcome === CALL_OUTCOME.DECLINED) {
        onDeclined();
      }
      // TODO: the userLastContactedTime should be updated.
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6" id="vet-schedule-call-card">
      <div className="flex flex-row items-start justify-between">
        <BarkUserContactDetails
          details={{
            userName,
            userEmail,
            userPhoneNumber,
            userResidency,
            userLastContactedTime,
          }}
        />
        {outcome === CALL_OUTCOME.APPOINTMENT && <ScheduledBadge />}
        {outcome === CALL_OUTCOME.DECLINED && <DeclinedBadge />}
      </div>

      <Separator className="border border-gray-400" />
      <p className={clsx({ "opacity-30": outcome !== undefined })}>
        Please indicate the outcome of the call
      </p>

      <div className="flex w-full flex-col gap-6 xl:flex-row">
        <BarkButton
          disabled={outcome !== undefined}
          variant="brand"
          onClick={() => submitOutcome(CALL_OUTCOME.APPOINTMENT)}
          className="w-full xl:w-40"
        >
          Scheduled
        </BarkButton>
        <BarkButton
          disabled={outcome !== undefined}
          variant="brandInverse"
          onClick={() => submitOutcome(CALL_OUTCOME.DECLINED)}
          className="w-full xl:w-40"
        >
          Declined
        </BarkButton>
      </div>
    </div>
  );
}
