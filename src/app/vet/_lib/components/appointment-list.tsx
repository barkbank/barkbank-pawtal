"use client";

import { BarkAppointment } from "@/lib/bark/models/bark-appointment";
import { AppointmentCard } from "./appointment-card";
import { ChangeEvent, useState } from "react";
import { getMatchingItems } from "@/lib/utilities/get-matching-items";
import { SearchInput } from "./search-input";

export function AppointmentList(props: { appointments: BarkAppointment[] }) {
  const { appointments } = props;
  const [query, setQuery] = useState<string>("");

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchReset = () => {
    setQuery("");
  };

  function getAppointmentStrings(appointment: BarkAppointment): string[] {
    const { dogName, dogBreed, ownerName } = appointment;
    return [dogName, dogBreed, ownerName];
  }

  const matchingAppointments = getMatchingItems({
    query,
    items: appointments,
    getStrings: getAppointmentStrings,
  });

  return (
    <div className="m-3 flex flex-col gap-3">
      <SearchInput
        query={query}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchReset={handleSearchReset}
      />
      <div className="flex flex-col gap-3">
        {matchingAppointments.map((appointment) => {
          const { appointmentId } = appointment;
          return (
            <AppointmentCard appointment={appointment} key={appointmentId} />
          );
        })}
      </div>
    </div>
  );
}
