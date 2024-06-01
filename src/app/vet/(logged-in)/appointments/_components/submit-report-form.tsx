"use client";

import { DateTimeField, DogWeightKgField } from "@/app/_lib/field-schemas";
import { BarkButton } from "@/components/bark/bark-button";
import { BarkForm, BarkFormInput } from "@/components/bark/bark-form";
import { BarkAppointment } from "@/lib/bark/bark-models";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import {
  SGT_ISO8601,
  SINGAPORE_TIME_ZONE,
  UTC_ISO8601,
  formatDateTime,
  parseCommonDateTime,
} from "@/lib/utilities/bark-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SubmitFormSchema = z.object({
  visitTime: DateTimeField.Schema,
  dogWeightKg: DogWeightKgField.Schema,

  // // BCS score range is 1-9 https://vcahospitals.com/know-your-pet/body-condition-scores
  // dogBodyConditioningScore: z.number().min(1).max(9),

  // dogHeartworm: PosNegNilSchema,
  // dogDea1Point1: PosNegNilSchema,
  // ineligibilityStatus: ReportedIneligibilitySchema,
  // ineligibilityReason: z.string(),
  // ineligibilityExpiryTime: z.date().nullable(),
  // dogDidDonateBlood: z.boolean(),
});

type SubmitFormType = z.infer<typeof SubmitFormSchema>;

function toBarkReportData(formData: SubmitFormType): Partial<BarkReportData> {
  return {
    visitTime: DateTimeField.parse(formData.visitTime),
    dogWeightKg: DogWeightKgField.parse(formData.dogWeightKg)!,
  };
}

function parseVisitTime(val: string): string | null {
  try {
    const d = parseCommonDateTime(val, SINGAPORE_TIME_ZONE);
    return formatDateTime(d, {
      format: "d MMM yyyy, h:mma",
      timeZone: SINGAPORE_TIME_ZONE,
    });
  } catch {
    return null;
  }
}

export function SubmitReportForm(props: { appointment: BarkAppointment }) {
  const { appointment } = props;
  const form = useForm<SubmitFormType>({
    resolver: zodResolver(SubmitFormSchema),
    defaultValues: {
      visitTime: "",
      dogWeightKg: "",
    },
  });
  const onSubmit = async (values: SubmitFormType) => {
    const parsedVisitTime = parseCommonDateTime(
      values.visitTime,
      SINGAPORE_TIME_ZONE,
    );
    const sgtISO8601 = formatDateTime(parsedVisitTime, SGT_ISO8601);
    const utcISO8601 = formatDateTime(parsedVisitTime, UTC_ISO8601);
    console.log({ values, parsedVisitTime, utcISO8601, sgtISO8601 });
  };
  const placeholderTime = formatDateTime(new Date(), {
    format: "d MMM yyyy h:mma",
    timeZone: SINGAPORE_TIME_ZONE,
  });
  return (
    <div>
      <p>Form for submitting report for appointment:</p>
      <pre>{JSON.stringify(appointment, null, 2)}</pre>
      <BarkForm form={form} onSubmit={onSubmit}>
        <BarkFormInput
          form={form}
          name="visitTime"
          label="Visit Time"
          type="text"
          description="Please provide the visit time, e.g. 16 Apr 2021 4:30pm"
        />
        <BarkFormInput
          form={form}
          name="dogWeightKg"
          label="Weight"
          type="text"
          description="Please provide the dog's weight in KG"
        />
        <div className="mt-6">
          <BarkButton variant="brand" type="submit">
            Submit
          </BarkButton>
        </div>
      </BarkForm>
    </div>
  );
}
