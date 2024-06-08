import { BarkAppointment } from "@/lib/bark/models/bark-appointment";
import { AppointmentCard } from "./appointment-card";

export function AppointmentList(props: { appointments: BarkAppointment[] }) {
  const { appointments } = props;
  return (
    <div className="m-3 flex flex-col gap-3">
      {appointments.map((appointment) => {
        const { appointmentId } = appointment;
        return (
          <AppointmentCard appointment={appointment} key={appointmentId} />
        );
      })}
    </div>
  );
}
