"use client";

import { BarkAppointment } from "@/lib/bark/models/bark-appointment";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { capitalize } from "lodash";
import { postBarkReportData } from "../actions/post-bark-report-data";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { GeneralReportForm } from "./general-report-form";
import { useToast } from "@/components/ui/use-toast";

export function SubmitReportForm(props: { appointment: BarkAppointment }) {
  const { appointment } = props;
  const { appointmentId, dogName, dogBreed, dogGender, ownerName } =
    appointment;
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(
    reportData: BarkReportData,
  ): Promise<Result<true, string>> {
    const { error } = await postBarkReportData({
      appointmentId,
      reportData,
    });
    if (error !== undefined) {
      return Err(error);
    }
    toast({
      title: "Submitted!",
      description: `Report for ${dogName} has been submitted.`,
      variant: "brandSuccess",
    });
    router.push(RoutePath.VET_APPOINTMENTS_LIST);
    return Ok(true);
  }

  async function handleCancel(): Promise<void> {
    router.push(RoutePath.VET_APPOINTMENTS_LIST);
  }

  return (
    <div className="prose">
      <h1>Submit Report</h1>
      <p>
        Please fill in this form to submit a medical report for <b>{dogName}</b>
        , a <b>{capitalize(dogGender)}</b> <b>{dogBreed}</b> belonging to{" "}
        <b>{ownerName}</b>. (Appointment ID: {appointmentId})
      </p>
      <GeneralReportForm
        purpose="SUBMIT"
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  );
}
