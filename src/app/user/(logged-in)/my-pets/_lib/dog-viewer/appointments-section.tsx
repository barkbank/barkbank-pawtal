import { Separator } from "@/components/ui/separator";
import { DogViewerData } from "./dog-viewer-data";

export function AppointmentsSection(props: { data: DogViewerData }) {
  const { data } = props;
  const { dogAppointments } = data;

  return (
    <div className="x-card flex flex-col gap-3">
      <p className="x-card-title">Appointments</p>
      <Separator />
      <pre>{JSON.stringify(dogAppointments, null, 2)}</pre>
    </div>
  );
}
