import { BarkAppointment } from "@/lib/bark/bark-models";

export function SubmitReportForm(props: { appointment: BarkAppointment }) {
  const { appointment } = props;
  return (
    <div>
      <p>
        Form for submitting report for appointment {JSON.stringify(appointment)}
      </p>
    </div>
  );
}
