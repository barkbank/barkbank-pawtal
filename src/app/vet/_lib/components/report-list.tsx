import { BarkReport } from "@/lib/bark/models/bark-report";
import { ReportCard } from "./report-card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function ReportList(props: { reports: BarkReport[] }) {
  const { reports } = props;
  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="flex flex-row items-center gap-3">
        <Input type="text" placeholder="Search..." className="text-base" />
        <X />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {reports.map((report) => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  );
}
