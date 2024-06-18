import { Separator } from "@/components/ui/separator";
import { DogViewerData } from "./dog-viewer-data";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";

export function ReportsSection(props: { data: DogViewerData }) {
  const { dogReports } = props.data;
  return (
    <div className="x-card flex flex-col gap-3">
      <p className="x-card-title">Reports</p>
      <Separator />
      {dogReports.map((report) => {
        const { reportId } = report;
        return <_Report key={reportId} report={report} />;
      })}
    </div>
  );
}

// WIP: Need to add vet details to the report. (Remember, reports can come from past preferred vets which may be different from the current.)
export function _Report(props: { report: BarkReport }) {
  const { report } = props;
  const {
    visitTime,
    vetId,
    dogName,
    dogWeightKg,
    dogHeartworm,
    dogBodyConditioningScore,
  } = report;
  const dateText = formatDateTime(visitTime, SGT_UI_DATE);

  return (
    <div>
      <div className="prose">
        <h4>
          {dateText} report from vet {vetId}.
        </h4>
        <p>
          {dogName} was presented on {dateText}, weighing in at {dogWeightKg}{" "}
          kilograms. Overall, its body conditioning score (BCS) was{" "}
          {dogBodyConditioningScore}.
        </p>
        {dogHeartworm === POS_NEG_NIL.POSITIVE && (
          <p>
            {dogName} tested positive for heartworms and is therefore ineligible
            for blood donation.
          </p>
        )}
        {dogHeartworm === POS_NEG_NIL.NEGATIVE && (
          <p>{dogName} tested negative for heartworms.</p>
        )}
      </div>
      {/* WIP: <pre>{JSON.stringify(report, null, 2)}</pre> */}
    </div>
  );
}
