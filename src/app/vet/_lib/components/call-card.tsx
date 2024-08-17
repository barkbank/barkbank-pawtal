import { BarkButton } from "@/components/bark/bark-button";
import { useOwnerContactDetails } from "../hooks/use-owner-contact-details";
import { BarkUserContactDetails } from "@/components/bark/bark-user-contact-details";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";
import { SchedulerOutcome } from "@/app/vet/_lib/models/scheduler-outcome";
import { postSchedulerOutcome } from "../actions/post-scheduler-outcome";
import { CODE } from "@/lib/utilities/bark-code";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";
import { DeclinedBadge, ScheduledBadge } from "./scheduler-badges";

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
  const { result, error } = data;
  if (error !== undefined) {
    return (
      <div>
        <p className="text-destructive">
          Failed to load owner contact details. Error code: {error}
        </p>
      </div>
    );
  }

  const { userTitle, userName, userPhoneNumber, vetUserLastContactedTime } =
    result;

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
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex flex-row items-start justify-between">
        <BarkUserContactDetails
          details={{
            userTitle,
            userName,
            userPhoneNumber,
            userResidency,
            userLastContactedTime,
          }}
        />
        <div className="hidden md:block">
          {outcome === CALL_OUTCOME.APPOINTMENT && <ScheduledBadge />}
          {outcome === CALL_OUTCOME.DECLINED && <DeclinedBadge />}
        </div>
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
          type="button"
        >
          Scheduled
        </BarkButton>
        <BarkButton
          disabled={outcome !== undefined}
          variant="brandInverse"
          onClick={() => submitOutcome(CALL_OUTCOME.DECLINED)}
          className="w-full xl:w-40"
          type="button"
        >
          Declined
        </BarkButton>
      </div>
    </div>
  );
}
