import { ReportView } from "@/app/_components/report-view";
import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { BarkButton } from "@/components/bark/bark-button";
import APP from "@/lib/app";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { opFetchReport } from "@/lib/bark/operations/op-fetch-report";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { reportId: string } }) {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const actorUserId = actor.getUserId();
  const { reportId } = props.params;
  const context = await APP.getBarkContext();
  const { result, error } = await opFetchReport(context, {
    reportId,
    actorUserId,
  });
  if (error !== undefined) {
    return <SimpleErrorPage error={error} />;
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
  const { reportId, dogName, vetName } = report;
  return (
    <div className="prose">
      <h1>Report #{reportId}</h1>
      <p>
        Report for {dogName} prepared by {vetName}.
      </p>
    </div>
  );
}

function _Controls(props: { report: BarkReport }) {
  const { report } = props;
  const { dogId } = report;
  return (
    <div>
      <BarkButton
        className="w-full md:w-40"
        variant="brandInverse"
        href={RoutePath.USER_VIEW_DOG(dogId)}
      >
        Back
      </BarkButton>
    </div>
  );
}
