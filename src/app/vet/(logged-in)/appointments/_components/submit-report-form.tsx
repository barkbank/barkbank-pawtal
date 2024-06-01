"use client";

import {
  BodyConditioningScoreField,
  DateTimeField,
  DogWeightKgField,
} from "@/app/_lib/field-schemas";
import { BarkButton } from "@/components/bark/bark-button";
import {
  BarkForm,
  BarkFormInput,
  BarkFormOption,
  BarkFormSelect,
} from "@/components/bark/bark-form";
import { BarkAppointment } from "@/lib/bark/bark-models";
import {
  BarkReportData,
  BarkReportDataSchema,
} from "@/lib/bark/models/bark-report-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SubmitFormSchema = z.object({
  visitTime: DateTimeField.Schema,
  dogWeightKg: DogWeightKgField.Schema,
  dogBodyConditioningScore: BodyConditioningScoreField.Schema,

  // dogHeartworm: PosNegNilSchema,
  // dogDea1Point1: PosNegNilSchema,
  // ineligibilityStatus: ReportedIneligibilitySchema,
  // ineligibilityReason: z.string(),
  // ineligibilityExpiryTime: z.date().nullable(),
  // dogDidDonateBlood: z.boolean(),
});

type SubmitFormType = z.infer<typeof SubmitFormSchema>;

function toBarkReportData(formData: SubmitFormType): BarkReportData {
  const values = {
    visitTime: DateTimeField.parse(formData.visitTime),
    dogWeightKg: DogWeightKgField.parse(formData.dogWeightKg)!,
    dogBodyConditioningScore: BodyConditioningScoreField.parse(
      formData.dogBodyConditioningScore,
    ),
  };
  console.log({ values });
  return BarkReportDataSchema.parse(values);
}

export function SubmitReportForm(props: { appointment: BarkAppointment }) {
  const { appointment } = props;
  const { appointmentId, dogName, dogBreed, dogGender, ownerName } =
    appointment;
  const form = useForm<SubmitFormType>({
    resolver: zodResolver(SubmitFormSchema),
    defaultValues: {
      visitTime: "",
      dogWeightKg: "",
    },
  });
  const onSubmit = async (values: SubmitFormType) => {
    const reportData = toBarkReportData(values);
    console.log(reportData);
  };
  return (
    <div>
      <p>Submitting report for appointment {appointmentId}.</p>
      <p>
        {dogName} is a {dogGender} {dogBreed} belonging to {ownerName}.
      </p>
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
          label="Dog's Weight (KG)"
          type="text"
        />
        <BarkFormSelect
          form={form}
          name="dogBodyConditioningScore"
          label="Dog's Body Conditioning Score (BCS)"
          placeholder="Select BCS"
          options={BodyConditioningScoreField.values.map((value: number) => {
            const option: BarkFormOption = {
              value: `${value}`,
              label: `${value}`,
            };
            return option;
          })}
          description="Body conditioning score is a value between 1 and 9"
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
