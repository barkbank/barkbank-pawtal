import { BarkButton } from "@/components/bark/bark-button";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { RoutePath } from "@/lib/route-path";
import { capitalize } from "lodash";

export function ReportView(props: { report: BarkReport }) {
  const { report } = props;
  const { reportId, dogName, dogGender, dogBreed, ownerName } = report;
  return (
    <div className="x-card">
      <div className="prose">
        <h1>Report</h1>
        <p>
          Below is the medical report for <b>{dogName}</b>, a{" "}
          <b>{capitalize(dogGender)}</b> <b>{dogBreed}</b> belonging to{" "}
          <b>{ownerName}</b>. (Report ID: {reportId})
        </p>
      </div>
      <p>TODO: Implement ReportView</p>
      <pre>{JSON.stringify(report, null, 2)}</pre>
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <BarkButton
          className="w-full md:w-40"
          variant="brandInverse"
          href={RoutePath.VET_REPORTS_LIST}
        >
          Back
        </BarkButton>
        <BarkButton
          className="w-full md:w-40"
          variant="brandInverse"
          href={RoutePath.VET_REPORTS_EDIT(reportId)}
        >
          Edit
        </BarkButton>
      </div>
    </div>
  );
}
