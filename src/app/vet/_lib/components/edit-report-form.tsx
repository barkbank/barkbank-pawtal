"use client";

import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { capitalize } from "lodash";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { GeneralReportForm } from "./general-report-form";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { postUpdatedReport } from "../actions/post-updated-report";
import { CODE } from "@/lib/utilities/bark-code";
import { useToast } from "@/components/ui/use-toast";

export function EditReportForm(props: { report: BarkReport }) {
  const { report } = props;
  const { reportId, dogName, dogBreed, dogGender, ownerName } = report;
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(
    reportData: BarkReportData,
  ): Promise<Result<true, string>> {
    const res = await postUpdatedReport({
      reportId,
      reportData,
    });
    if (res !== CODE.OK) {
      return Err(res);
    }
    toast({
      title: "Saved!",
      description: `Changes to report for ${dogName} have been saved.`,
      variant: "brandSuccess",
    });
    router.push(RoutePath.VET_REPORTS_VIEW(reportId));
    return Ok(true);
  }

  async function handleCancel(): Promise<void> {
    router.push(RoutePath.VET_REPORTS_VIEW(reportId));
  }

  return (
    <div className="prose">
      <h1>Edit Report</h1>
      <p>
        Please fill in this form to update the medical report for{" "}
        <b>{dogName}</b>, a <b>{capitalize(dogGender)}</b> <b>{dogBreed}</b>{" "}
        belonging to <b>{ownerName}</b>. (Report ID: {reportId})
      </p>
      <GeneralReportForm
        purpose="EDIT"
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        reportData={report}
      />
    </div>
  );
}
