import { Separator } from "@/components/ui/separator";
import { DogViewerData } from "./dog-viewer-data";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";

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
  const { visitTime, vetName } = report;
  const dateText = formatDateTime(visitTime, SGT_UI_DATE);

  // WIP: Clicking on the card should send users to report page.
  return (
    <div className="x-card bg-gray-100">
      <p>Date: {dateText}</p>
      <p>Clinic: {vetName}</p>
    </div>
  );
}
