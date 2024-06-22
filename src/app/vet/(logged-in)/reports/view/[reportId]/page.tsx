import { ReportView } from "@/app/vet/_lib/components/report-view";
import { BarkButton } from "@/components/bark/bark-button";
import { BarkError } from "@/components/bark/bark-error";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { opFetchReport } from "@/lib/bark/operations/op-fetch-report";
import { RoutePath } from "@/lib/route-path";
import { capitalize } from "lodash";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { reportId: string } }) {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const { reportId } = props.params;
  const context = await APP.getBarkContext();
  const { result, error } = await opFetchReport(context, {
    reportId,
    actorVetId: actor.getVetId(),
  });
  if (error !== undefined) {
    return (
      <BarkError className="m-3">Failed to fetch report: {error}</BarkError>
    );
  }
  const { report } = result;
  return (
    <div className="m-3 flex flex-col gap-3">
      <_Introduction report={report} />
      <ReportView report={report} />
      <_Controls report={report} />
    </div>
  );
}

function _Introduction(props: { report: BarkReport }) {
  const { report } = props;
  const { reportId, dogName, dogGender, dogBreed, ownerName } = report;
  return (
    <div className="prose">
      <h1>Report</h1>
      <p>
        Below is the medical report for <b>{dogName}</b>, a{" "}
        <b>{capitalize(dogGender)}</b> <b>{dogBreed}</b> belonging to{" "}
        <b>{ownerName}</b>. (Report ID: {reportId})
      </p>
    </div>
  );
}

function _Controls(props: { report: BarkReport }) {
  const { report } = props;
  const { reportId } = report;
  return (
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
  );
}
