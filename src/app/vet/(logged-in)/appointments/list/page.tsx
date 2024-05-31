import { BarkButton } from "@/components/bark/bark-button";
import { BarkH1 } from "@/components/bark/bark-typography";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { BarkAppointment } from "@/lib/bark/bark-models";
import { opFetchAppointmentsByVetId } from "@/lib/bark/operations/op-fetch-appointments-by-vet-id";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { capitalize } from "lodash";
import { redirect } from "next/navigation";

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

  const AppointmentCard = (props: { appointment: BarkAppointment }) => {
    const { appointmentId, dogName, dogGender, dogBreed, ownerName } =
      props.appointment;
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dogName}</CardTitle>
          <CardDescription>
            A {capitalize(dogGender)} {dogBreed} owned by {ownerName}.
          </CardDescription>
        </CardHeader>
        <CardFooter>
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
        </CardFooter>
      </Card>
    );
  };

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
