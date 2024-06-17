import { NA_TEXT } from "@/app/_lib/constants";
import { BarkButton } from "@/components/bark/bark-button";
import { Textarea } from "@/components/ui/textarea";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { REPORTED_INELIGIBILITY } from "@/lib/bark/enums/reported-ineligibility";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";
import { RoutePath } from "@/lib/route-path";
import {
  SGT_UI_DATE,
  SGT_UI_DATE_TIME,
  formatDateTime,
} from "@/lib/utilities/bark-time";
import { formatDistanceStrict } from "date-fns";
import { capitalize, toString } from "lodash";

export function ReportView(props: { report: BarkReport }) {
  const { report } = props;
  const {
    reportId,
    dogName,
    dogGender,
    dogBreed,
    ownerName,
    visitTime,
    dogHeartworm,
    dogBodyConditioningScore,
    dogDea1Point1,
    dogDidDonateBlood,
    dogWeightKg,
    ineligibilityStatus,
    ineligibilityReason,
    ineligibilityExpiryTime,
    reportCreationTime,
    reportModificationTime,
  } = report;

  type Field = {
    label: string;
    value: string | React.ReactNode;
  };

  const fields: Field[] = [
    { label: "Visit Date", value: formatDateTime(visitTime, SGT_UI_DATE) },
    { label: "Owner Name", value: ownerName },
    { label: "Dog Name", value: dogName },
    { label: "Dog Gender", value: capitalize(dogGender) },
    { label: "Dog Breed", value: dogBreed },
    { label: "Dog Weight (KG)", value: toString(dogWeightKg) },
    {
      label: "Dog Body Conditioning Score",
      value: toString(dogBodyConditioningScore),
    },
    {
      label: "Heartworm Test Result",
      value: (() => {
        if (dogHeartworm === POS_NEG_NIL.NIL) {
          return "Did not test";
        }
        return capitalize(dogHeartworm);
      })(),
    },
    {
      label: "Blood Test Result",
      value: (() => {
        if (dogDea1Point1 === POS_NEG_NIL.POSITIVE) {
          return "DEA1.1 Positive";
        }
        if (dogDea1Point1 === POS_NEG_NIL.NEGATIVE) {
          return "DEA1.1 Negative";
        }
        return "Did not test";
      })(),
    },
    { label: "Did Donate Blood", value: dogDidDonateBlood ? "Yes" : "No" },
    {
      label: "Any reported ineligibility?",
      value: (() => {
        if (
          ineligibilityStatus === REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE
        ) {
          return "Yes (temporarily)";
        }
        if (
          ineligibilityStatus === REPORTED_INELIGIBILITY.PERMANENTLY_INELIGIBLE
        ) {
          return "Yes (permanently)";
        }
        return "No";
      })(),
    },
    {
      label: "Ingligibility Reason",
      value: (() => {
        if (ineligibilityStatus === REPORTED_INELIGIBILITY.NIL) {
          return NA_TEXT;
        }
        return (
          <Textarea
            className="mt-3 bg-slate-100"
            readOnly={true}
            rows={8}
            value={ineligibilityReason}
          />
        );
      })(),
    },
    {
      label: "Ineligible Until",
      value: (() => {
        if (
          ineligibilityStatus !== REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE
        ) {
          return NA_TEXT;
        }
        if (ineligibilityExpiryTime === null) return "Unspecified";
        const dateText = formatDateTime(ineligibilityExpiryTime, SGT_UI_DATE);
        const durationText = formatDistanceStrict(
          ineligibilityExpiryTime,
          visitTime,
          {
            addSuffix: false,
          },
        );
        return `${dateText} (${durationText} after the visit date)`;
      })(),
    },
    {
      label: "Report Creation Time",
      value: formatDateTime(reportCreationTime, SGT_UI_DATE_TIME),
    },
    {
      label: "Report Modification Time",
      value: formatDateTime(reportModificationTime, SGT_UI_DATE_TIME),
    },
  ];

  const FieldItem = (props: { field: Field }) => {
    const { field } = props;
    const { label, value } = field;
    const elmValue =
      typeof value === "string" ? (
        <p className="text-base font-bold">{value}</p>
      ) : (
        value
      );
    return (
      <div className="w-full">
        <h2 className="text-base">{label}:</h2>
        {elmValue}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="prose">
        <h1>Report</h1>
        <p>
          Below is the medical report for <b>{dogName}</b>, a{" "}
          <b>{capitalize(dogGender)}</b> <b>{dogBreed}</b> belonging to{" "}
          <b>{ownerName}</b>. (Report ID: {reportId})
        </p>
      </div>
      <div className="x-card flex flex-col gap-3">
        {fields.map((field) => (
          <FieldItem key={field.label} field={field} />
        ))}
      </div>
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <BarkButton
          className="w-full md:w-40"
          variant="brandInverse"
          href={RoutePath.VET_REPORTS_LIST}
        >
          Back
        </BarkButton>
        <BarkButton
          className="w-full md:w-40"
          variant="brandInverse"
          href={RoutePath.VET_REPORTS_EDIT(reportId)}
        >
          Edit
        </BarkButton>
      </div>
    </div>
  );
}
