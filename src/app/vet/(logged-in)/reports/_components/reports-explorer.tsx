"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

type Report = {
  callId: string;
  status: "PENDING" | "SUBMITTED" | "CANCELLED";
  dogName: string;
  dogBreed: string;
  ownerName: string;
};

const REPORTS: Report[] = [
  {
    callId: "001",
    status: "PENDING",
    dogName: "Ralf Rapsody",
    dogBreed: "Ranger Hood",
    ownerName: "Roger Penrose",
  },
  {
    callId: "002",
    status: "SUBMITTED",
    dogName: "Bella",
    dogBreed: "Golden Retriever",
    ownerName: "Emma Watson",
  },
  {
    callId: "003",
    status: "CANCELLED",
    dogName: "Max",
    dogBreed: "German Shepherd",
    ownerName: "John Doe",
  },
  {
    callId: "004",
    status: "PENDING",
    dogName: "Luna",
    dogBreed: "Labrador Retriever",
    ownerName: "Sarah Connor",
  },
  {
    callId: "005",
    status: "SUBMITTED",
    dogName: "Charlie",
    dogBreed: "Beagle",
    ownerName: "Chris Evans",
  },
  {
    callId: "006",
    status: "CANCELLED",
    dogName: "Molly",
    dogBreed: "Poodle",
    ownerName: "Jane Austen",
  },
  {
    callId: "007",
    status: "PENDING",
    dogName: "Daisy",
    dogBreed: "Bulldog",
    ownerName: "Bruce Wayne",
  },
  {
    callId: "008",
    status: "SUBMITTED",
    dogName: "Bailey",
    dogBreed: "Dachshund",
    ownerName: "Clark Kent",
  },
  {
    callId: "009",
    status: "CANCELLED",
    dogName: "Sadie",
    dogBreed: "Boxer",
    ownerName: "Diana Prince",
  },
  {
    callId: "010",
    status: "PENDING",
    dogName: "Buddy",
    dogBreed: "Pomeranian",
    ownerName: "Tony Stark",
  },
];

export function ReportsExplorer() {
  return (
    <div className="m-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <Input type="text" placeholder="Search..." />
          <X />
        </div>
        <Separator />
        {REPORTS.map((report) => {
          const { callId, status, dogName, dogBreed, ownerName } = report;
          return (
            <div
              key={callId}
              className="rounded-md p-3 shadow-sm shadow-slate-400"
            >
              {status} | {dogName} | {ownerName}
            </div>
          );
        })}
      </div>
    </div>
  );
}
