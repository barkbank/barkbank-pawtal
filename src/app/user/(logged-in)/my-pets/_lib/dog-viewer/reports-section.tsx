import { Separator } from "@/components/ui/separator";
import { DogViewerData } from "./dog-viewer-data";
import { BarkReport } from "@/lib/bark/models/report-models";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";
import Link from "next/link";
import { RoutePath } from "@/lib/route-path";

export function ReportsSection(props: { data: DogViewerData }) {
  const { dogReports } = props.data;
  return (
    <div className="x-card flex flex-col gap-3">
      <p className="x-card-title">Reports</p>
      <Separator />
      {dogReports.length === 0 && <_NoReports />}
      {dogReports.length > 0 && <_ReportList reports={dogReports} />}
    </div>
  );
}

export function _NoReports() {
  return (
    <div className="prose">
      <p>There are no reports currently.</p>
    </div>
  );
}

export function _ReportList(props: { reports: BarkReport[] }) {
  const { reports } = props;
  return (
    <div className="flex flex-col gap-3">
      {reports.map((report) => {
        const { reportId } = report;
        return <_Report key={reportId} report={report} />;
      })}
    </div>
  );
}

export function _Report(props: { report: BarkReport }) {
  const { report } = props;
  const { reportId, visitTime, vetName } = report;
  const dateText = formatDateTime(visitTime, SGT_UI_DATE);

  return (
    <Link
      className="x-card cursor-pointer bg-gray-100 md:hover:bg-gray-200"
      href={RoutePath.USER_VIEW_REPORT(reportId)}
    >
      <p>Date: {dateText}</p>
      <p>Clinic: {vetName}</p>
    </Link>
  );
}
