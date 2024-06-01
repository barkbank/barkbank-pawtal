"use client";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkForm, BarkFormInput } from "@/components/bark/bark-form";
import { BarkAppointment } from "@/lib/bark/bark-models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SubmitFormSchema = z.object({
  visitTime: z.string(),
  // dogWeightKg: z.number(),

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

export function SubmitReportForm(props: { appointment: BarkAppointment }) {
  const { appointment } = props;
  const form = useForm<SubmitFormType>({
    resolver: zodResolver(SubmitFormSchema),
    defaultValues: {
      visitTime: "",
    },
  });
  const onSubmit = async (values: SubmitFormType) => {
    console.log({ values });
  };
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
