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
import { Result } from "@/lib/utilities/result";
import {
  SGT_UI_DATE,
  SGT_UI_DATE_TIME,
  formatDateTime,
} from "@/lib/utilities/bark-time";

const ReportFormDataSchema = z.object({
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

type ReportFormData = z.infer<typeof ReportFormDataSchema>;

function toBarkReportData(formData: ReportFormData): BarkReportData {
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

function toReportFormData(reportData: BarkReportData): ReportFormData {
  const {
    visitTime,
    dogWeightKg,
    dogBodyConditioningScore,
    dogDidDonateBlood,
    ineligibilityExpiryTime,
    ...otherFields
  } = reportData;
  const formData: ReportFormData = {
    visitTime: formatDateTime(visitTime, SGT_UI_DATE_TIME),
    dogWeightKg: `${dogWeightKg}`,
    dogBodyConditioningScore: `${dogBodyConditioningScore}`,
    dogDidDonateBlood: dogDidDonateBlood ? "YES" : "NO",
    ineligibilityExpiryTime:
      ineligibilityExpiryTime === null
        ? ""
        : formatDateTime(ineligibilityExpiryTime, SGT_UI_DATE),
    ...otherFields,
  };
  return ReportFormDataSchema.parse(formData);
}

const DEFAULT_REPORT_FORM_DATA = {
  visitTime: "",
  dogWeightKg: "",
  ineligibilityReason: "",
  ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
  ineligibilityExpiryTime: "",
};

export function GeneralReportForm(props: {
  purpose: "SUBMIT" | "EDIT";
  handleSubmit: (values: BarkReportData) => Promise<Result<true, string>>;
  handleCancel: () => Promise<void>;
  reportData?: BarkReportData;
}) {
  const { purpose, handleSubmit, handleCancel, reportData } = props;
  const form = useForm<ReportFormData>({
    resolver: zodResolver(ReportFormDataSchema),
    defaultValues:
      reportData === undefined
        ? DEFAULT_REPORT_FORM_DATA
        : toReportFormData(reportData),
  });
  // WIP: validate reported ineligibility across form fields.

  const currentValues = form.watch();
  const hasReason = currentValues.ineligibilityReason !== "";
  const isTemporary =
    currentValues.ineligibilityStatus ===
    REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE;

  const onSubmit = async (values: ReportFormData) => {
    const reportData = toBarkReportData(values);
    const { error } = await handleSubmit(reportData);
    if (error !== undefined) {
      form.setError("root", { message: error });
    }
  };

  const onCancel = handleCancel;

  return (
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
      <BarkFormTextArea
        form={form}
        name="ineligibilityReason"
        label="Please indicate if there are reasons why this dog might be ineligible for blood donation"
      />
      {hasReason && (
        <BarkFormRadioGroup
          form={form}
          name="ineligibilityStatus"
          label="Is this reason for ineligibility temporary or permanent?"
          options={[
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
      )}
      {hasReason && isTemporary && (
        <BarkFormInput
          form={form}
          name="ineligibilityExpiryTime"
          label="For temporary ineligibility, please indicate a date after which dog might be eligible again"
          type="text"
        />
      )}
      <BarkFormError form={form} />
      <div className="mt-6 flex w-full flex-col gap-3 md:flex-row">
        <BarkButton className="w-full md:w-40" variant="brand" type="submit">
          {purpose === "SUBMIT" ? "Submit Report" : "Save Changes"}
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
  );
}
