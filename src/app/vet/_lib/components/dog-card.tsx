import { Separator } from "@/components/ui/separator";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { DOG_GENDER } from "@/lib/bark/models/dog-gender";
import { getFormattedAge } from "@/lib/utilities/bark-age";
import { AvailableDog } from "@/lib/vet/vet-models";
import clsx from "clsx";
import { capitalize } from "lodash";
import { SchedulerOutcome } from "@/app/vet/_lib/models/scheduler-outcome";
import { DeclinedBadge, ScheduledBadge } from "./scheduler-badges";

export function DogCard(props: {
  dog: AvailableDog;
  onSelect: () => void;
  selectedDogId: string | null;
  outcome: SchedulerOutcome | undefined;
  children?: React.ReactNode;
}) {
  const { dog, onSelect, selectedDogId, outcome, children } = props;
  const { dogName, dogId } = dog;
  // TODO: when the latest call-outcome related to the dog is DECLINED, the dog card should indicate how long ago that was.
  return (
    <div
      className={clsx("m-1 rounded-md  p-3 shadow-sm shadow-slate-400", {
        "bg-white": dogId !== selectedDogId,
        "bg-brand-brown": dogId === selectedDogId,
      })}
      onClick={onSelect}
    >
      {/* A small m-1 above is needed because the ScrollArea crops the content a little. */}

      {/* Name */}
      <div className="flex flex-row justify-between">
        <div className="font-semibold">{dogName}</div>
        {outcome === CALL_OUTCOME.APPOINTMENT && <ScheduledBadge />}
        {outcome === CALL_OUTCOME.DECLINED && <DeclinedBadge />}
      </div>

      <Separator className="my-1" />

      {/* Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2">
        <Item label="Breed" value={getBreed(dog)} />
        <Item label="Weight" value={getWeight(dog)} />
        <Item label="Age" value={getAge(dog)} />
        <Item
          label="Has ever received blood"
          value={getBloodTransfusionHistory(dog)}
        />
        <Item label="Gender" value={getGender(dog)} />
        <Item label="Was ever pregnant" value={getEverPregnant(dog)} />
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

function getBreed(dog: AvailableDog): string {
  return dog.dogBreed;
}

function getWeight(dog: AvailableDog): string {
  const { dogWeightKg } = dog;
  if (dogWeightKg === null) {
    return "Unknown";
  }
  return `${dogWeightKg} KG`;
}

function getAge(dog: AvailableDog): string {
  const { dogBirthday } = dog;
  return getFormattedAge(dogBirthday, new Date());
}

function getBloodTransfusionHistory(dog: AvailableDog): string {
  const { dogEverReceivedTransfusion } = dog;
  return capitalize(dogEverReceivedTransfusion);
}

function getGender(dog: AvailableDog): string {
  const { dogGender } = dog;
  return capitalize(dogGender);
}

function getEverPregnant(dog: AvailableDog): string {
  const { dogEverPregnant, dogGender } = dog;
  if (dogGender === DOG_GENDER.MALE) {
    return "N/A";
  }
  return capitalize(dogEverPregnant);
}
