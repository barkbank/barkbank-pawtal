import { BarkError } from "@/components/bark/bark-error";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { opFetchReportsByVetId } from "@/lib/bark/operations/op-fetch-reports-by-vet-id";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { ReportCard } from "../_components/report-card";

const xReportCard = (props: { report: BarkReport }) => {
  const { report } = props;
  return (
    <div className="rounded-md  p-3 shadow-sm shadow-slate-400">
      Report: <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
};

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
  return (
    <div className="m-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  );
}
