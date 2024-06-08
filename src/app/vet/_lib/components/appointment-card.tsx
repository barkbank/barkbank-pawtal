import { BarkAppointment } from "@/lib/bark/models/bark-appointment";
import { DogAvatar } from "./dog-avatar";
import { Separator } from "@/components/ui/separator";
import { BarkButton } from "@/components/bark/bark-button";
import { RoutePath } from "@/lib/route-path";

const Item = (props: { label: string; value: string }) => {
  const { label, value } = props;
  return (
    <div>
      {label}: <span className="font-semibold">{value}</span>
    </div>
  );
};

export function AppointmentCard(props: { appointment: BarkAppointment }) {
  const { appointmentId, dogName, dogGender, dogBreed, ownerName } =
    props.appointment;
  return (
    <div className="x-card flex flex-col gap-2">
      <div className="flex flex-row gap-3">
        <DogAvatar dogGender={dogGender} />
        <div className="x-card-title">{dogName}</div>
      </div>
      <Separator />
      <div className="flex flex-col">
        <Item label="Breed" value={dogBreed} />
        <Item label="Gender" value={dogGender} />
        <Item label="Owner" value={ownerName} />
      </div>
      <Separator />
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <BarkButton
          className="w-full md:w-48"
          variant="brand"
          href={RoutePath.VET_APPOINTMENTS_SUBMIT(appointmentId)}
        >
          Submit Report
        </BarkButton>
        <BarkButton
          className="w-full md:w-48"
          variant="brandInverse"
          href={RoutePath.VET_APPOINTMENTS_CANCEL(appointmentId)}
        >
          Cancel Appointment
        </BarkButton>
      </div>
    </div>
  );
}
