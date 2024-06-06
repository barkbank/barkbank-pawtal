"use client";

import {
  BodyConditioningScoreField,
  DateField,
  DateTimeField,
  DogWeightKgField,
} from "@/app/_lib/field-schemas";
import { BarkButton } from "@/components/bark/bark-button";
import {
  BarkForm,
  BarkFormError,
  BarkFormInput,
  BarkFormOption,
  BarkFormRadioGroup,
  BarkFormSelect,
  BarkFormTextArea,
} from "@/components/bark/bark-form";
import { BarkAppointment } from "@/lib/bark/models/bark-appointment";
import {
  BarkReportData,
  BarkReportDataSchema,
} from "@/lib/bark/models/bark-report-data";
import {
  POS_NEG_NIL,
  PosNegNilSchema,
  REPORTED_INELIGIBILITY,
  ReportedIneligibilitySchema,
  YES_NO_UNKNOWN,
} from "@/lib/data/db-enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { capitalize } from "lodash";
import { postBarkReportData } from "../actions/post-bark-report-data";

const SubmitFormSchema = z.object({
  visitTime: DateTimeField.Schema,
  dogWeightKg: DogWeightKgField.Schema,
  dogBodyConditioningScore: BodyConditioningScoreField.Schema,
  dogHeartworm: PosNegNilSchema,
  dogDea1Point1: PosNegNilSchema,
  ineligibilityStatus: ReportedIneligibilitySchema,
  ineligibilityReason: z.string().min(0),
  ineligibilityExpiryTime: DateField.getSchema({ optional: true }),
  dogDidDonateBlood: z.enum([YES_NO_UNKNOWN.YES, YES_NO_UNKNOWN.NO]),
});

type SubmitFormType = z.infer<typeof SubmitFormSchema>;

function toBarkReportData(formData: SubmitFormType): BarkReportData {
  const {
    visitTime,
    dogWeightKg,
    dogBodyConditioningScore,
    dogDidDonateBlood,
    ineligibilityExpiryTime,
    ...otherFields
  } = formData;
  const values = {
    visitTime: DateTimeField.parse(visitTime),
    dogWeightKg: DogWeightKgField.parse(dogWeightKg)!,
    dogBodyConditioningScore: BodyConditioningScoreField.parse(
      dogBodyConditioningScore,
    ),
    dogDidDonateBlood: dogDidDonateBlood === "YES",
    ineligibilityExpiryTime:
      ineligibilityExpiryTime === ""
        ? null
        : DateField.parse(ineligibilityExpiryTime),
    ...otherFields,
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
      ineligibilityReason: "",
      ineligibilityExpiryTime: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: SubmitFormType) => {
    const reportData = toBarkReportData(values);
    console.log(reportData);
    const { result, error } = await postBarkReportData({
      appointmentId,
      reportData,
    });
    if (error !== undefined) {
      form.setError("root", { message: error });
      return;
    }
    router.push(RoutePath.VET_APPOINTMENTS_LIST);
  };

  const onCancel = async () => {
    router.push(RoutePath.VET_APPOINTMENTS_LIST);
  };

  return (
    <div className="prose">
      <h1>Submit Report</h1>
      <p>
        Please fill in this form to submit a medical report for <b>{dogName}</b>
        , a <b>{capitalize(dogGender)}</b> <b>{dogBreed}</b> belonging to{" "}
        <b>{ownerName}</b>. (Appointment ID: {appointmentId})
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
        <BarkFormRadioGroup
          form={form}
          name="dogDidDonateBlood"
          label="Please indicate if dog donated blood"
          options={[
            {
              value: YES_NO_UNKNOWN.YES,
              label: `Yes`,
            },
            {
              value: YES_NO_UNKNOWN.NO,
              label: `No`,
            },
          ]}
        />
        <BarkFormRadioGroup
          form={form}
          name="ineligibilityStatus"
          label="Please indicate if dog is eligible for blood donation"
          // placeholder="Select eligibility"
          options={[
            {
              value: REPORTED_INELIGIBILITY.NIL,
              label: `Eligible`,
            },
            {
              value: REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE,
              label: `Temporarily Ineligible`,
            },
            {
              value: REPORTED_INELIGIBILITY.PERMANENTLY_INELIGIBLE,
              label: `Permanently Ineligible`,
            },
          ]}
        />
        <BarkFormTextArea
          form={form}
          name="ineligibilityReason"
          label="Please indicate a reason (if ineligible)"
        />
        <BarkFormInput
          form={form}
          name="ineligibilityExpiryTime"
          label="Please indicate a date after which dog might be eligible again"
          type="text"
        />
        <BarkFormError form={form} />
        <div className="mt-6 flex w-full flex-col gap-3 md:flex-row">
          <BarkButton className="w-full md:w-40" variant="brand" type="submit">
            Submit Report
          </BarkButton>
          <BarkButton
            className="w-full md:w-40"
            variant="brandInverse"
            onClick={onCancel}
          >
            Cancel
          </BarkButton>
        </div>
      </BarkForm>
    </div>
  );
}
