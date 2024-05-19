"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardPenLineIcon,
  Eye,
  NotebookIcon,
  PenSquare,
  Plus,
  PlusCircle,
  PlusSquare,
  ShareIcon,
  X,
} from "lucide-react";

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

const ReportCard = ({ report }: { report: Report }) => {
  const { callId, status, dogName, dogBreed, ownerName } = report;

  return (
    <Card key={callId} className="shadow-md">
      <CardHeader>
        <CardTitle>{dogName}</CardTitle>
        <CardDescription>Report is {status}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Breed: {dogBreed}</p>
        <p>Owner: {ownerName}</p>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <Eye />
        <PenSquare />
        <Plus />
        <PlusCircle />
        <NotebookIcon />
        <ShareIcon />
        <PlusSquare />
        <ClipboardPenLineIcon />
      </CardFooter>
    </Card>
  );
};
export function ReportsExplorer() {
  return (
    <div className="m-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <Input type="text" placeholder="Search..." />
          <X />
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {REPORTS.map((report) => (
            <ReportCard key={report.callId} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}
