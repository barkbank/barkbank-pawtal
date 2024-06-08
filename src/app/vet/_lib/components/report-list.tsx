"use client";

import { BarkReport } from "@/lib/bark/models/bark-report";
import { ReportCard } from "./report-card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { getMatchingItems } from "@/lib/utilities/get-matching-items";

export function ReportList(props: { reports: BarkReport[] }) {
  const { reports } = props;

  const [query, setQuery] = useState<string>("");

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchReset = () => {
    setQuery("");
  }

  function getReportTokens(report: BarkReport): string[] {
    const { dogName, dogBreed, ownerName } = report;
    const nameTokens = dogName.split(" ");
    const breedTokens = dogBreed.split(" ");
    const ownerTokens = ownerName.split(" ");
    return nameTokens.concat(breedTokens).concat(ownerTokens);
  }

  const matchingReports = getMatchingItems({
    query,
    items: reports,
    getTokens: getReportTokens,
  });
  console.log({ query, matchingReports });

  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="flex flex-row items-center gap-3">
        <Input
          type="text"
          placeholder="Search..."
          className="text-base"
          value={query}
          onChange={handleSearchInputChange}
        />
        <X className="cursor-pointer" onClick={handleSearchReset}/>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {matchingReports.map((report) => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  );
}
