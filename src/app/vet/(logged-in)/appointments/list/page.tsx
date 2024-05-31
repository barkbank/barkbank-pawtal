import { BarkButton } from "@/components/bark/bark-button";
import { BarkH1 } from "@/components/bark/bark-typography";
import { Separator } from "@/components/ui/separator";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { BarkAppointment } from "@/lib/bark/bark-models";
import { opFetchAppointmentsByVetId } from "@/lib/bark/operations/op-fetch-appointments-by-vet-id";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { redirect } from "next/navigation";

const Item = (props: { label: string; value: string }) => {
  const { label, value } = props;
  return (
    <div>
      {label}: <span className="font-semibold">{value}</span>
    </div>
  );
};

const AppointmentCard = (props: { appointment: BarkAppointment }) => {
  const { appointmentId, dogName, dogGender, dogBreed, ownerName } =
    props.appointment;
  return (
    <div className="flex  flex-col gap-2 rounded-md p-3 shadow-sm shadow-slate-400">
      <div className="font-semibold">{dogName}</div>
      <Separator />
      <div className="grid grid-cols-1">
        <Item label="Breed" value={dogBreed} />
        <Item label="Gender" value={dogGender} />
        <Item label="Owner" value={ownerName} />
      </div>
      <Separator />
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <BarkButton
          className="w-full"
          variant="brand"
          href={RoutePath.VET_APPOINTMENTS_SUBMIT(appointmentId)}
        >
          Submit Report
        </BarkButton>
        <BarkButton
          className="w-full"
          variant="brandInverse"
          href={RoutePath.VET_APPOINTMENTS_CANCEL(appointmentId)}
        >
          Cancel
        </BarkButton>
      </div>
    </div>
  );
};

export default async function Page() {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const context = await APP.getBarkContext();
  const { vetId } = actor.getParams();

  const { result, error } = await opFetchAppointmentsByVetId(context, {
    vetId,
  });
  if (error === CODE.FAILED) {
    return <div>Failed to fetch appointments</div>;
  }
  const { appointments } = result;

  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkH1>Appointments</BarkH1>
      <div className="flex flex-col gap-3">
        {appointments.map((appointment) => {
          const { appointmentId } = appointment;
          return (
            <AppointmentCard appointment={appointment} key={appointmentId} />
          );
        })}
      </div>
    </div>
  );
}