import { EditReportForm } from "@/app/vet/_lib/components/edit-report-form";
import { BarkError } from "@/components/bark/bark-error";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { opFetchReport } from "@/lib/bark/operations/op-fetch-report";
import { RoutePath } from "@/lib/route-path";
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
    <div className="m-3">
      <EditReportForm report={report} />
    </div>
  );
}
