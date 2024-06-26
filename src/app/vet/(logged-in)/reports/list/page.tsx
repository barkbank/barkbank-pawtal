import { ReportList } from "@/app/vet/_lib/components/report-list";
import { BarkError } from "@/components/bark/bark-error";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { opFetchReportsByVetId } from "@/lib/bark/operations/op-fetch-reports-by-vet-id";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const context = await APP.getBarkContext();
  const vetId = actor.getVetId();
  const { result, error } = await opFetchReportsByVetId(context, { vetId });
  if (error !== undefined) {
    return <BarkError className="m-3">Failed to fetch reports.</BarkError>;
  }
  const { reports } = result;
  return <ReportList reports={reports} />;
}
