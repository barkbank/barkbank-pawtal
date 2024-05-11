"use client";

import { AvailableDog } from "@/lib/vet/vet-models";
import { DogCard } from "./dog-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchedulerOutcome, SchedulerState } from "../_lib/scheduler-models";
import { useState } from "react";
import { CallCard } from "./call-card";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { BarkButton } from "@/components/bark/bark-button";

export function AppointmentScheduler(props: { dogs: AvailableDog[] }) {
  const [schedulerState, setSchedulerState] = useState<SchedulerState>({
    dogs: props.dogs,
    selectedDogId: null,
    ownerContactDetails: null,
    outcomes: {},
  });
  const { dogs, selectedDogId, outcomes } = schedulerState;

  function selectDog(dogId: string) {
    setSchedulerState({
      ...schedulerState,
      selectedDogId: dogId,
    });
  }

  function closeCallCard() {
    setSchedulerState({
      ...schedulerState,
      selectedDogId: null,
    });
  }

  function recordCallOutcome(args: {
    dogId: string;
    callOutcome: SchedulerOutcome;
  }) {
    const { dogId, callOutcome } = args;
    const state = { ...schedulerState };
    state.outcomes[dogId] = callOutcome;
    setSchedulerState(state);
  }

  const callCard =
    selectedDogId === null ? undefined : (
      <CallCard
        dogId={selectedDogId}
        outcome={outcomes[selectedDogId]}
        onScheduled={() => {
          recordCallOutcome({
            dogId: selectedDogId,
            callOutcome: CALL_OUTCOME.APPOINTMENT,
          });
        }}
        onDeclined={() => {
          recordCallOutcome({
            dogId: selectedDogId,
            callOutcome: CALL_OUTCOME.DECLINED,
          });
        }}
      />
    );

  const dogCardList = (
    <div className="flex flex-col gap-3">
      {dogs.map((dog) => (
        <DogCard
          dog={dog}
          key={dog.dogId}
          onSelect={() => selectDog(dog.dogId)}
          selectedDogId={selectedDogId}
          outcome={outcomes[dog.dogId]}
        />
      ))}
    </div>
  );

  const mobileLayout2 = (
    <div className="relative">
      {dogCardList}
      {selectedDogId !== null && (
        <div className="fixed left-0 top-[100px] w-full bg-brand-brown">
          <BarkButton variant="brandInverse" onClick={() => closeCallCard()}>
            Close
          </BarkButton>
          {callCard}
        </div>
      )}
    </div>
  );

  const mobileLayout =
    selectedDogId === null ? (
      <div className="p-2">{dogCardList}</div>
    ) : (
      <div className="">
        <BarkButton variant="brandInverse" onClick={() => closeCallCard()}>
          Close
        </BarkButton>
        {callCard}
      </div>
    );

  const mobileLayout4 =
    selectedDogId === null ? (
      <div className="">
        <ScrollArea className="h-screen">{dogCardList}</ScrollArea>
      </div>
    ) : (
      <div className="">
        <BarkButton variant="brandInverse" onClick={() => closeCallCard()}>
          Close
        </BarkButton>
        {callCard}
      </div>
    );

  // TODO: If an appointment invitation was declined within the last 7 days, the related outcomes[dogId] should be set to DECLINED.
  // TODO: Should have option to sort dog cards by - Lightest First; Heaviest First; Oldest First; Youngest First; Most recently created;
  // TODO: Should have option to exclude dogs contacted in the - Last 7 days; Last 30 days; Last 90 days
  // TODO: Should have option to exclude owners contacted in the - Last 7 days; Last 30 days; Last 90 days
  const desktopLayout = (
    <div className="m-3 flex flex-col gap-3 md:flex-row">
      {/* List of dog cards */}
      <ScrollArea className="max-h-full md:max-h-[calc(100vh*7/8)] md:w-1/2 md:rounded-md md:bg-slate-100 md:p-3 md:shadow-inner">
        {dogCardList}
      </ScrollArea>

      {/* Right-side Pane */}
      {selectedDogId !== null && (
        <div className="hidden rounded-md bg-brand-brown p-3 shadow-sm shadow-slate-400 md:block md:min-h-[calc(100vh*7/8)] md:w-1/2">
          {callCard}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="hidden md:block">{desktopLayout}</div>
      <div className="md:hidden">{mobileLayout}</div>
    </div>
  );
}
