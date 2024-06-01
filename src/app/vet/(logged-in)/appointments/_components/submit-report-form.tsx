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
  BarkFormRadioGroup,
  BarkFormSelect,
} from "@/components/bark/bark-form";
import { BarkAppointment } from "@/lib/bark/bark-models";
import {
  BarkReportData,
  BarkReportDataSchema,
} from "@/lib/bark/models/bark-report-data";
import { POS_NEG_NIL, PosNegNilSchema } from "@/lib/data/db-enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SubmitFormSchema = z.object({
  visitTime: DateTimeField.Schema,
  dogWeightKg: DogWeightKgField.Schema,
  dogBodyConditioningScore: BodyConditioningScoreField.Schema,
  dogHeartworm: PosNegNilSchema,
  dogDea1Point1: PosNegNilSchema,
  // ineligibilityStatus: ReportedIneligibilitySchema,
  // ineligibilityReason: z.string(),
  // ineligibilityExpiryTime: z.date().nullable(),
  // dogDidDonateBlood: z.boolean(),
});

type SubmitFormType = z.infer<typeof SubmitFormSchema>;

function toBarkReportData(formData: SubmitFormType): BarkReportData {
  const {visitTime, dogWeightKg, dogBodyConditioningScore, ...otherFields} = formData;
  const values = {
    visitTime: DateTimeField.parse(visitTime),
    dogWeightKg: DogWeightKgField.parse(dogWeightKg)!,
    dogBodyConditioningScore: BodyConditioningScoreField.parse(
      dogBodyConditioningScore,
    ),
    ...otherFields
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
        <BarkFormRadioGroup
          form={form}
          name="dogHeartworm"
          label="Heartworm Test Result"
          options={[
            {
              value: POS_NEG_NIL.POSITIVE,
              label: "Tested positive for heartworm",
            },
            {
              value: POS_NEG_NIL.NEGATIVE,
              label: "Tested negative for heartworm",
            },
            {
              value: POS_NEG_NIL.NIL,
              label: "Did not test",
            },
          ]}
          description="Please indicate the result of heartworm test, if any"
        />
        <BarkFormRadioGroup
          form={form}
          name="dogDea1Point1"
          label="Blood Test Result"
          options={[
            {
              value: POS_NEG_NIL.POSITIVE,
              label: "DEA 1.1 Positive",
            },
            {
              value: POS_NEG_NIL.NEGATIVE,
              label: "DEA 1.1 Negative",
            },
            {
              value: POS_NEG_NIL.NIL,
              label: "Did not test",
            },
          ]}
          description="Please indicate the result of blood test, if any"
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
