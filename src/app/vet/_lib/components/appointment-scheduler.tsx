"use client";

import { AvailableDog } from "@/lib/vet/vet-models";
import { DogCard } from "./dog-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchedulerState } from "../models/scheduler-state";
import { SchedulerOutcome } from "@/app/vet/_lib/models/scheduler-outcome";
import { ChangeEvent, useState } from "react";
import { CallCard } from "./call-card";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { SearchInput } from "./search-input";
import { getMatchingItems } from "@/lib/utilities/get-matching-items";

export function AppointmentScheduler(props: { dogs: AvailableDog[] }) {
  const [schedulerState, setSchedulerState] = useState<SchedulerState>({
    dogs: props.dogs,
    selectedDogId: null,
    ownerContactDetails: null,
    outcomes: {},
  });
  const { dogs, selectedDogId, outcomes } = schedulerState;

  const [query, setQuery] = useState<string>("");

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchReset = () => {
    setQuery("");
  };

  function getStrings(dog: AvailableDog): string[] {
    const { dogName, dogBreed } = dog;
    return [dogName, dogBreed];
  }

  const matchingDogs = getMatchingItems({
    query,
    items: dogs,
    getStrings,
  });

  function toggleDogSelection(dogId: string) {
    const toggledSelectedDogId = selectedDogId === dogId ? null : dogId;
    setSchedulerState({
      ...schedulerState,
      selectedDogId: toggledSelectedDogId,
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

  const selectedDogCallCard =
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
      {matchingDogs.map((dog) => (
        <DogCard
          dog={dog}
          key={dog.dogId}
          onSelect={() => toggleDogSelection(dog.dogId)}
          selectedDogId={selectedDogId}
          outcome={outcomes[dog.dogId]}
        >
          {selectedDogCallCard !== undefined && selectedDogId === dog.dogId && (
            <div className="md:hidden">{selectedDogCallCard}</div>
          )}
        </DogCard>
      ))}
    </div>
  );

  // TODO: If an appointment invitation was declined within the last 7 days, the related outcomes[dogId] should be set to DECLINED.
  // TODO: Should have option to sort dog cards by - Lightest First; Heaviest First; Oldest First; Youngest First; Most recently created;
  // TODO: Should have option to exclude dogs contacted in the - Last 7 days; Last 30 days; Last 90 days
  // TODO: Should have option to exclude owners contacted in the - Last 7 days; Last 30 days; Last 90 days

  return (
    <div className="m-3 flex flex-col gap-3">
      <SearchInput
        query={query}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchReset={handleSearchReset}
      />

      <div className="flex flex-col gap-3 md:flex-row">
        {/* List of dog cards */}
        <ScrollArea
          id="vet-appointment-scheduler-dog-list"
          className="max-h-full md:max-h-[calc(100vh*7/8)] md:w-1/2 md:rounded-md md:bg-slate-100 md:p-3 md:shadow-inner"
        >
          {dogCardList}
        </ScrollArea>

        {/* Right-side Pane */}
        {selectedDogId !== null && (
          <div
            id="vet-appointment-scheduler-right-side-pane"
            className="hidden rounded-md bg-brand-brown p-3 shadow-sm shadow-slate-400 md:block md:min-h-[calc(100vh*7/8)] md:w-1/2"
          >
            {selectedDogCallCard}
          </div>
        )}
      </div>
    </div>
  );
}
