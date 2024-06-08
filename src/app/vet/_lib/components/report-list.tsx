import { BarkReport } from "@/lib/bark/models/bark-report";
import { ReportCard } from "./report-card";

export function ReportList(props: {reports: BarkReport[]}) {
  const {reports} = props;
  return (
    <div className="m-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {reports.map((report) => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  );
}
