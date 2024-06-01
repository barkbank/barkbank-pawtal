import { BarkForm } from "@/components/bark/bark-form";
import { BarkAppointment } from "@/lib/bark/bark-models";

export function SubmitReportForm(props: { appointment: BarkAppointment }) {
  const { appointment } = props;
  return (
    <div>
      <p>Form for submitting report for appointment:</p>
      <pre>{JSON.stringify(appointment, null, 2)}</pre>
    </div>
  );
}
