"use client";

import {
  BodyConditioningScoreField,
} from "@/app/_lib/field-schemas";
import { DateOrDurationField } from "@/app/_lib/field-schemas/date-or-duration-field";
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
} from "@/lib/data/db-enums";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Result } from "@/lib/utilities/result";
import {
  SGT_UI_DATE,
  SINGAPORE_TIME_ZONE,
  formatDateTime,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { Separator } from "@/components/ui/separator";
import { RequiredDogWeightKgField } from "@/app/_lib/field-schemas/required-dog-weight-kg-field";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";

const expiryTimeField = new DateOrDurationField({
  optional: true,
  timeZone: SINGAPORE_TIME_ZONE,
});

const ReportFormDataSchema = z.object({
  visitTime: RequiredDateField.new().schema(),
  dogWeightKg: RequiredDogWeightKgField.new().schema(),
  dogBodyConditioningScore: BodyConditioningScoreField.Schema,
  dogHeartworm: PosNegNilSchema,
  dogDea1Point1: PosNegNilSchema,
  ineligibilityReason: z.string().min(0),
  ineligibilityStatus: ReportedIneligibilitySchema,
  ineligibilityExpiryTime: expiryTimeField.schema(),
  dogDidDonateBlood: z.enum([YES_NO_UNKNOWN.YES, YES_NO_UNKNOWN.NO]),
});

// Refine schema to do cross-field validations
const schemaWithRefinements = ReportFormDataSchema.refine(
  (data) => {
    const { ineligibilityReason, ineligibilityStatus } = data;
    const triggered =
      ineligibilityReason !== "" &&
      ineligibilityStatus === REPORTED_INELIGIBILITY.NIL;
    return !triggered;
  },
  {
    message: "Please specify if ineligibility is temporary or permanent",
    path: ["ineligibilityStatus"],
  },
)
  .refine(
    (data) => {
      const {
        ineligibilityReason,
        ineligibilityStatus,
        ineligibilityExpiryTime,
      } = data;
      const triggered =
        ineligibilityReason !== "" &&
        ineligibilityStatus === REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE &&
        ineligibilityExpiryTime === "";
      return !triggered;
    },
    {
      message:
        "Please specify a duration or date for the temporary ineligibility",
      path: ["ineligibilityExpiryTime"],
    },
  )
  .refine(
    (data) => {
      const { visitTime } = data;
      const triggered = (() => {
        try {
          const tsVisit = parseCommonDate(
            visitTime,
            SINGAPORE_TIME_ZONE,
          ).getTime();
          const tsNow = Date.now();
          return tsNow < tsVisit;
        } catch {
          // Formatting erros do not trigger this rule.
          return false;
        }
      })();
      return !triggered;
    },
    {
      message: "Visit date cannot be in the future",
      path: ["visitTime"],
    },
  )
  .refine(
    (data) => {
      const {
        visitTime,
        ineligibilityReason,
        ineligibilityStatus,
        ineligibilityExpiryTime,
      } = data;
      const triggered = (() => {
        if (ineligibilityReason === "") {
          return false;
        }
        if (
          ineligibilityStatus !== REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE
        ) {
          return false;
        }
        try {
          const tsVisit = parseCommonDate(visitTime, SINGAPORE_TIME_ZONE);
          const tsExpire = expiryTimeField.resolveDate({
            reference: tsVisit,
            value: ineligibilityExpiryTime,
          });
          return tsExpire <= tsVisit;
        } catch {
          return false;
        }
      })();
      return !triggered;
    },
    {
      message: "Expiry date should be after the visit date",
      path: ["ineligibilityExpiryTime"],
    },
  );

type ReportFormData = z.infer<typeof ReportFormDataSchema>;

function toBarkReportData(formData: ReportFormData): BarkReportData {
  const {
    visitTime,
    dogWeightKg,
    dogBodyConditioningScore,
    dogDidDonateBlood,
    ineligibilityReason,
    ineligibilityStatus,
    ineligibilityExpiryTime,
    ...otherFields
  } = formData;
  const resolvedVisitTime = RequiredDateField.new().parse(visitTime);
  const values: BarkReportData = {
    visitTime: resolvedVisitTime,
    dogWeightKg: RequiredDogWeightKgField.new().parse(dogWeightKg),
    dogBodyConditioningScore: BodyConditioningScoreField.parse(
      dogBodyConditioningScore,
    ),
    dogDidDonateBlood: dogDidDonateBlood === "YES",
    ineligibilityReason,
    ineligibilityStatus: (() => {
      if (ineligibilityReason === "") {
        return REPORTED_INELIGIBILITY.NIL;
      }
      return ineligibilityStatus;
    })(),
    ineligibilityExpiryTime: (() => {
      if (ineligibilityReason === "") {
        return null;
      }
      if (
        ineligibilityStatus !== REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE
      ) {
        return null;
      }
      return expiryTimeField.resolveDate({
        reference: resolvedVisitTime,
        value: ineligibilityExpiryTime,
      });
    })(),
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
    visitTime: formatDateTime(visitTime, SGT_UI_DATE),
    dogWeightKg: `${dogWeightKg}`,
    dogBodyConditioningScore: `${dogBodyConditioningScore}`,
    dogDidDonateBlood: dogDidDonateBlood ? "YES" : "NO",
    ineligibilityExpiryTime: (() => {
      if (ineligibilityExpiryTime === null) {
        return "";
      }
      return formatDateTime(ineligibilityExpiryTime, SGT_UI_DATE);
    })(),
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
    resolver: zodResolver(schemaWithRefinements),
    defaultValues:
      reportData === undefined
        ? DEFAULT_REPORT_FORM_DATA
        : toReportFormData(reportData),
  });

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
      <div className="flex flex-col gap-3">
        <div className="x-card x-card-bg prose">
          <h2 className="x-card-title">Visit & Outcomes</h2>
          <p>
            This section is about capturing details of the visit and the
            outcomes.
          </p>
          <Separator />
          <BarkFormInput
            form={form}
            name="visitTime"
            label="Visit Date"
            type="text"
            description="Please provide the visit date, e.g. 16 Apr 2021"
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
        </div>
        <div className="x-card x-card-bg prose">
          <h2 className="x-card-title">Observations</h2>
          <p>
            This section captures medical observations made during the visit.
          </p>
          <Separator />
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
        </div>
        <div className="x-card x-card-bg prose">
          <h2 className="x-card-title">Ineligibility</h2>
          <p>
            This section captures reasons for why the dog might be ineligible
            for blood donation.
          </p>
          <Separator />
          <BarkFormTextArea
            form={form}
            name="ineligibilityReason"
            label="Please indicate if there are reasons why this dog might be ineligible for blood donation. (Leave blank if there are none.)"
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
              description="Please provide a date (e.g. 16 Apr 2021) or duration (e.g. 4 weeks)"
            />
          )}
        </div>
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
      </div>
    </BarkForm>
  );
}
