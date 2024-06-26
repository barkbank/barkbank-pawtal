"use client";

import { DogCard } from "./dog-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchedulerState } from "../models/scheduler-state";
import { SchedulerOutcome } from "@/app/vet/_lib/models/scheduler-outcome";
import { ChangeEvent, useState } from "react";
import { CallCard } from "./call-card";
import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";
import { SearchInput } from "./search-input";
import { getMatchingItems } from "@/lib/utilities/get-matching-items";
import {
  SORT_OPTION,
  SortOption,
  SortOptionSelector,
} from "./sort-option-selector";
import { CallTask } from "@/lib/bark/models/call-task";
import {
  compare,
  compareNullableWithNullFirst,
} from "@/lib/utilities/comparators";

export function AppointmentScheduler(props: { dogs: CallTask[] }) {
  const [schedulerState, setSchedulerState] = useState<SchedulerState>({
    dogs: props.dogs,
    selectedDogId: null,
    ownerContactDetails: null,
    outcomes: {},
  });
  const { dogs, selectedDogId, outcomes } = schedulerState;

  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>(
    SORT_OPTION.DOG_OLDEST_CALL_FIRST,
  );

  const onSortValueChange = (value: SortOption) => {
    setSortBy(value);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchReset = () => {
    setQuery("");
  };

  function getStrings(dog: CallTask): string[] {
    const { dogName, dogBreed, ownerName } = dog;
    return [dogName, dogBreed, ownerName];
  }

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

  // Apply search filter and sort option
  const dogsToDisplay = (() => {
    // console.log({ query, sortBy });
    const result = getMatchingItems({
      query,
      items: dogs,
      getStrings,
    });
    if (sortBy === SORT_OPTION.AGE_OLDEST_FIRST) {
      result.sort((a, b) => {
        return compare(a.dogBirthday, b.dogBirthday);
      });
    }
    if (sortBy === SORT_OPTION.AGE_YOUNGEST_FIRST) {
      result.sort((a, b) => {
        return compare(b.dogBirthday, a.dogBirthday);
      });
    }
    if (sortBy === SORT_OPTION.WEIGHT_HEAVIEST_FIRST) {
      result.sort((a, b) => {
        return compare(b.dogWeightKg ?? 0, a.dogWeightKg ?? 0);
      });
    }
    if (sortBy === SORT_OPTION.WEIGHT_LIGHTEST_FIRST) {
      result.sort((a, b) => {
        return compare(a.dogWeightKg ?? 0, b.dogWeightKg ?? 0);
      });
    }
    if (sortBy === SORT_OPTION.OWNER_OLDEST_CALL_FIRST) {
      result.sort((a, b) => {
        return compareNullableWithNullFirst(
          a.ownerLastContactedTime,
          b.ownerLastContactedTime,
        );
      });
    }
    if (sortBy === SORT_OPTION.OWNER_RECENT_CALL_FIRST) {
      result.sort((a, b) => {
        return compareNullableWithNullFirst(
          b.ownerLastContactedTime,
          a.ownerLastContactedTime,
        );
      });
    }
    if (sortBy === SORT_OPTION.DOG_OLDEST_CALL_FIRST) {
      result.sort((a, b) => {
        return compareNullableWithNullFirst(
          a.dogLastContactedTime,
          b.dogLastContactedTime,
        );
      });
    }
    if (sortBy === SORT_OPTION.DOG_RECENT_CALL_FIRST) {
      result.sort((a, b) => {
        return compareNullableWithNullFirst(
          b.dogLastContactedTime,
          a.dogLastContactedTime,
        );
      });
    }
    return result;
  })();

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
      {dogsToDisplay.map((dog) => (
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

  return (
    <div className="m-3 flex flex-col gap-3">
      <SearchInput
        query={query}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchReset={handleSearchReset}
      />
      <div className="flex flex-row gap-3">
        <div className="w-[370px]">
          <SortOptionSelector
            value={sortBy}
            onValueChange={onSortValueChange}
          />
        </div>
      </div>
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
