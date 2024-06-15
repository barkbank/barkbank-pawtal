import { Separator } from "@/components/ui/separator";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { getFormattedAge } from "@/lib/utilities/bark-age";
import clsx from "clsx";
import { capitalize } from "lodash";
import { SchedulerOutcome } from "@/app/vet/_lib/models/scheduler-outcome";
import { DeclinedBadge, ScheduledBadge } from "./scheduler-badges";
import { DogAvatar } from "./dog-avatar";
import { NA_TEXT } from "@/app/_lib/constants";
import { CallTask } from "@/lib/bark/models/call-task";
import { formatDistance } from "date-fns";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

export function DogCard(props: {
  dog: CallTask;
  onSelect: () => void;
  selectedDogId: string | null;
  outcome: SchedulerOutcome | undefined;
  children?: React.ReactNode;
}) {
  const { dog, onSelect, selectedDogId, outcome, children } = props;
  const { dogName, dogGender, dogId, dogLastContactedTime } = dog;
  const { isScheduled, isDeclined } = resolveBadge(dog, outcome);
  // TODO: when the latest call-outcome related to the dog is DECLINED, the dog card should indicate how long ago that was.
  return (
    <div
      className={clsx("x-card m-1", {
        "x-card-bg": dogId !== selectedDogId,
        "x-card-bg-selected": dogId === selectedDogId,
      })}
      onClick={onSelect}
    >
      {/* A small m-1 above is needed because the ScrollArea crops the content a little. */}

      {/* Name */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
          <DogAvatar dogGender={dogGender} />
          <div className="x-card-title">{dogName}</div>
        </div>
        {isScheduled && <ScheduledBadge />}
        {isDeclined && (
          <DeclinedBadge dogLastContactedTime={dogLastContactedTime} />
        )}
      </div>

      <Separator className="my-1" />

      {/* Details */}
      <div className="flex flex-col">
        <Item label="Breed" value={getBreed(dog)} />
        <Item label="Weight" value={getWeight(dog)} />
        <Item label="Age" value={getAge(dog)} />
        <Item label="Gender" value={getGender(dog)} />
        <Item
          label="Has ever received blood"
          value={getBloodTransfusionHistory(dog)}
        />
        <Item label="Was ever pregnant" value={getEverPregnant(dog)} />
        <Item label="Owner" value={dog.ownerName} />
        <Item
          label="Owner last contacted"
          value={getLastContacted(dog.ownerLastContactedTime)}
        />
        <Item
          label="Dog last contacted"
          value={getLastContacted(dog.dogLastContactedTime)}
        />
      </div>

      {children}
    </div>
  );
}

function Item(props: { label: string; value: string }) {
  const { label, value } = props;
  return (
    <div>
      {label}: <span className="font-semibold">{value}</span>
    </div>
  );
}

function resolveBadge(
  dog: CallTask,
  outcome: SchedulerOutcome | undefined,
): {
  isScheduled: boolean;
  isDeclined: boolean;
} {
  if (outcome === CALL_OUTCOME.APPOINTMENT) {
    return {
      isScheduled: true,
      isDeclined: false,
    };
  }
  if (outcome === CALL_OUTCOME.DECLINED) {
    return {
      isScheduled: false,
      isDeclined: true,
    };
  }
  const contactDate = dog.dogLastContactedTime;
  if (contactDate === null) {
    return {
      isScheduled: false,
      isDeclined: false,
    };
  }
  const delta = Date.now() - contactDate.getTime();
  const threshold = MILLIS_PER_WEEK;
  return {
    isScheduled: false,
    isDeclined: delta < threshold,
  };
}

function getBreed(dog: CallTask): string {
  return dog.dogBreed;
}

function getWeight(dog: CallTask): string {
  const { dogWeightKg } = dog;
  if (dogWeightKg === null) {
    return "Unknown";
  }
  return `${dogWeightKg} KG`;
}

function getAge(dog: CallTask): string {
  const { dogBirthday } = dog;
  return getFormattedAge(dogBirthday, new Date());
}

function getBloodTransfusionHistory(dog: CallTask): string {
  const { dogEverReceivedTransfusion } = dog;
  return capitalize(dogEverReceivedTransfusion);
}

function getGender(dog: CallTask): string {
  const { dogGender } = dog;
  return capitalize(dogGender);
}

function getEverPregnant(dog: CallTask): string {
  const { dogEverPregnant, dogGender } = dog;
  if (dogGender === DOG_GENDER.MALE) {
    return NA_TEXT;
  }
  return capitalize(dogEverPregnant);
}

function getLastContacted(time: Date | null): string {
  if (time === null) {
    return NA_TEXT;
  }
  return formatDistance(time, new Date(), {
    includeSeconds: false,
    addSuffix: true,
  });
}
