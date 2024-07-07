import { BarkError } from "@/components/bark/bark-error";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { opFetchAppointment } from "@/lib/bark/operations/op-fetch-appointment";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { APPOINTMENT_STATUS } from "@/lib/bark/enums/appointment-status";
import { SubmitReportForm } from "@/app/vet/_lib/components/submit-report-form";
import { BarkBackLink } from "@/components/bark/bark-back-link";

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
  if (appointment.appointmentStatus !== APPOINTMENT_STATUS.PENDING) {
    redirect(RoutePath.VET_APPOINTMENTS_LIST);
  }

  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.VET_APPOINTMENTS_LIST} />
      <SubmitReportForm appointment={appointment} />
    </div>
  );
}
