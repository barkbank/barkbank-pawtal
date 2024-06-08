"use client";

import { BarkReport } from "@/lib/bark/models/bark-report";
import { ReportCard } from "./report-card";
import { ChangeEvent, useState } from "react";
import { getMatchingItems } from "@/lib/utilities/get-matching-items";
import { SearchInput } from "./search-input";

export function ReportList(props: { reports: BarkReport[] }) {
  const { reports } = props;

  const [query, setQuery] = useState<string>("");

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchReset = () => {
    setQuery("");
  };

  function getReportStrings(report: BarkReport): string[] {
    const { dogName, dogBreed, ownerName } = report;
    return [dogName, dogBreed, ownerName];
  }

  const matchingReports = getMatchingItems({
    query,
    items: reports,
    getStrings: getReportStrings,
  });

  return (
    <div className="m-3 flex flex-col gap-3">
      <SearchInput
        query={query}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchReset={handleSearchReset}
      />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {matchingReports.map((report) => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  );
}
