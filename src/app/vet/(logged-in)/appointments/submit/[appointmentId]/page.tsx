import { BarkError } from "@/components/bark/bark-error";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { opFetchAppointment } from "@/lib/bark/operations/op-fetch-appointment";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { SubmitReportForm } from "../../_components/submit-report-form";

export default async function Page(props: {
  params: { appointmentId: string };
}) {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const { appointmentId } = props.params;
  const context = await APP.getBarkContext();
  const { result, error } = await opFetchAppointment(context, {
    appointmentId,
  });
  if (error !== undefined) {
    return (
      <div className="m-3">
        <BarkError>Failed to retrieve appointment details: {error}</BarkError>
      </div>
    );
  }
  const { appointment } = result;
  if (appointment.vetId !== actor.getVetId()) {
    return (
      <div className="m-3">
        <BarkError>FOBIDDEN</BarkError>
      </div>
    );
  }
  return (
    <div className="m-3">
      <SubmitReportForm appointment={appointment} />
    </div>
  );
}
