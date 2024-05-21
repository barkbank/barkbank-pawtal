"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Link from "next/link";

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

const ReportHeaderCell = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <div className="font-semibold">{children}</div>;
};

const ReportCell = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <div className="flex flex-row gap-3">{children}</div>;
};

const ReportCellLabel = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <div className="md:hidden">{children}</div>;
};

const ReportCellValue = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <div className="font-semibold md:font-normal">{children}</div>;
};

const ReportListHeader = () => {
  return (
    <div className="top-20 hidden grid-cols-1 gap-3 rounded-md bg-brand-brown p-3 shadow-md md:sticky md:grid md:grid-cols-5">
      {/* <div className="sticky top-[72px] grid grid-cols-1 gap-3 px-3 py-3 backdrop-blur-sm md:grid-cols-4"> */}
      <ReportHeaderCell>Status</ReportHeaderCell>
      <ReportHeaderCell>Dog</ReportHeaderCell>
      <ReportHeaderCell>Breed</ReportHeaderCell>
      <ReportHeaderCell>Owner</ReportHeaderCell>
      <ReportHeaderCell>Actions</ReportHeaderCell>
    </div>
  );
};

const ReportListItem = ({ report }: { report: Report }) => {
  const { callId, status, dogName, dogBreed, ownerName } = report;
  const actionIcons = (() => {
    if (status === "PENDING") {
      return (
        <div className="flex flex-row gap-3">
          <Link
            href={`/vet/submit-report/${callId}`}
            className="text-green-800"
          >
            Submit
          </Link>
        </div>
      );
    } else {
      return (
        <div className="flex flex-row gap-3">
          <Link href={`/vet/view-report/${callId}`} className="text-blue-800">
            View
          </Link>
        </div>
      );
    }
  })();

  return (
    <div className="grid grid-cols-1 gap-3 rounded-md p-3 shadow-md hover:bg-slate-100 md:grid-cols-5 md:shadow-none">
      <ReportCell>
        <ReportCellLabel>Status:</ReportCellLabel>
        <ReportCellValue>
          <Badge>{status}</Badge>
        </ReportCellValue>
      </ReportCell>
      <ReportCell>
        <ReportCellLabel>Dog:</ReportCellLabel>
        <ReportCellValue>{dogName}</ReportCellValue>
      </ReportCell>
      <ReportCell>
        <ReportCellLabel>Breed:</ReportCellLabel>
        <ReportCellValue>{dogBreed}</ReportCellValue>
      </ReportCell>
      <ReportCell>
        <ReportCellLabel>Owner:</ReportCellLabel>
        <ReportCellValue>{ownerName}</ReportCellValue>
      </ReportCell>
      <ReportCell>
        <ReportCellLabel>Actions:</ReportCellLabel>
        <ReportCellValue>{actionIcons}</ReportCellValue>
      </ReportCell>
    </div>
  );
};

export const ReportsExplorer = () => {
  return (
    <div className="m-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <Input type="text" placeholder="Search..." />
          <X />
        </div>
        <Separator />
        <div className="flex flex-col gap-0">
          <ReportListHeader />
          {REPORTS.map((report) => (
            <ReportListItem key={report.callId} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
};
