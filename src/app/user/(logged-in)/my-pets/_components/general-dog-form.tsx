"use client";

import {
  BarkForm,
  BarkFormDateInput,
  BarkFormInput,
  BarkFormOption,
  BarkFormParagraph,
  BarkFormRadioGroup,
} from "@/components/bark/bark-form";
import { isValidWeightKg } from "@/lib/utilities/bark-utils";
import {
  DOG_ANTIGEN_PRESENCE,
  DOG_GENDER,
  PARTICIPATION_STATUS,
  YES_NO_UNKNOWN,
} from "@/lib/data/db-enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BarkButton } from "@/components/bark/bark-button";
import { BarkH1 } from "@/components/bark/bark-typography";

const FORM_SCHEMA = z.object({
  dogName: z.string().min(1, { message: "Name cannot be empty" }),
  dogBreed: z.string(),
  dogBirthday: z
    .string()
    .min(1, { message: "Please fill in a birthday" })
    .refine(
      (value) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(value) && !isNaN(Date.parse(value));
      },
      {
        message: "Birthday must be a valid date in the format YYYY-MM-DD",
      },
    ),
  dogGender: z.nativeEnum(DOG_GENDER),
  dogWeightKg: z.string().refine(isValidWeightKg, {
    message: "Weight should be a positive number or left blank",
  }),
  dogDea1Point1: z.nativeEnum(DOG_ANTIGEN_PRESENCE),
  dogEverReceivedTransfusion: z.nativeEnum(YES_NO_UNKNOWN),
  dogEverPregnant: z.nativeEnum(YES_NO_UNKNOWN),
  dogPreferredVetId: z.string().optional(),
  dogParticipationStatus: z.nativeEnum(PARTICIPATION_STATUS),
  dogNonParticipationReason: z.string(),
  dogParticipationResumeDate: z.string(),
});

export type DogFormData = z.infer<typeof FORM_SCHEMA>;

const EMPTY_VALUES: DogFormData = {
  dogName: "",
  dogBreed: "",
  dogBirthday: "",
  dogGender: DOG_GENDER.UNKNOWN,
  dogWeightKg: "",
  dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN,
  dogEverReceivedTransfusion: YES_NO_UNKNOWN.UNKNOWN,
  dogEverPregnant: YES_NO_UNKNOWN.UNKNOWN,
  dogPreferredVetId: "",
  dogParticipationStatus: PARTICIPATION_STATUS.PARTICIPATING,
  dogNonParticipationReason: "",
  dogParticipationResumeDate: "",
};

export default function GeneralDogForm(props: {
  formTitle: string;
  vetOptions: BarkFormOption[];
  prefillData?: DogFormData;
  onSubmit: (values: DogFormData) => Promise<void>;
}) {
  const { formTitle, vetOptions, prefillData, onSubmit } = props;
  const form = useForm<DogFormData>({
    resolver: zodResolver(
      FORM_SCHEMA.extend({
        // Only if there are more than 1 vet options, we require the user to select one. Else vet will be predetermine.
        dogPreferredVetId:
          vetOptions.length <= 1
            ? FORM_SCHEMA.shape.dogPreferredVetId
            : z.string().min(1, { message: "Please select an option" }),
      }),
    ),
    defaultValues: { ...EMPTY_VALUES, ...prefillData },
  });

  return (
    <div>
      <BarkH1>{formTitle}</BarkH1>
      <BarkFormParagraph>
        Please fill in the required information.
      </BarkFormParagraph>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormInput form={form} label="Name" name="dogName" />

        <BarkFormInput form={form} label="Breed" name="dogBreed" type="text" />

        <BarkFormDateInput
          form={form}
          label="Birthday"
          name="dogBirthday"
          description="Use YYYY-MM-DD format. Approximations are okay."
        />

        <BarkFormRadioGroup
          form={form}
          label="Sex"
          name="dogGender"
          layout="radio"
          options={[
            { label: "Male", value: DOG_GENDER.MALE },
            { label: "Female", value: DOG_GENDER.FEMALE },
          ]}
        />

        <BarkFormInput
          form={form}
          label="Weight"
          description="Specify weight in kilograms. E.g. 23.4"
          name="dogWeightKg"
          type="text"
        />

        <BarkFormRadioGroup
          form={form}
          label="Blood Type"
          name="dogDea1Point1"
          options={[
            {
              label: "I don't know",
              value: DOG_ANTIGEN_PRESENCE.UNKNOWN,
            },
            {
              label: "D.E.A 1.1 positive",
              value: DOG_ANTIGEN_PRESENCE.POSITIVE,
            },
            {
              label: "D.E.A 1.1 negative",
              value: DOG_ANTIGEN_PRESENCE.NEGATIVE,
            },
          ]}
        />

        <BarkFormRadioGroup
          form={form}
          label="Ever Received Blood Transfusion"
          name="dogEverReceivedTransfusion"
          layout="radio"
          options={[
            {
              label: "I don't know",
              value: YES_NO_UNKNOWN.UNKNOWN,
            },
            {
              label: "Yes",
              value: YES_NO_UNKNOWN.YES,
            },
            {
              label: "No",
              value: YES_NO_UNKNOWN.NO,
            },
          ]}
        />

        <BarkFormRadioGroup
          form={form}
          label="Ever Pregnant"
          name="dogEverPregnant"
          layout="radio"
          options={[
            {
              label: "I don't know",
              value: YES_NO_UNKNOWN.UNKNOWN,
            },
            {
              label: "Yes",
              value: YES_NO_UNKNOWN.YES,
            },
            {
              label: "No",
              value: YES_NO_UNKNOWN.NO,
            },
          ]}
        />

        {vetOptions.length > 1 && (
          <BarkFormRadioGroup
            form={form}
            label="Preferred Donation Point"
            name="dogPreferredVetId"
            options={vetOptions}
          />
        )}

        <BarkFormRadioGroup
          form={form}
          label="Participation Status"
          name="dogParticipationStatus"
          options={[
            {
              label: "Participating",
              value: PARTICIPATION_STATUS.PARTICIPATING,
            },
            {
              label: "Paused",
              value: PARTICIPATION_STATUS.PAUSED,
            },
            {
              label: "Opted-Out",
              value: PARTICIPATION_STATUS.OPTED_OUT,
            },
          ]}
        />

        <BarkFormInput
          form={form}
          label="Non-participation Reason"
          description="Applicable only if not participating—i.e. paused or opted-out."
          name="dogNonParticipationReason"
          type="text"
        />

        <BarkFormInput
          form={form}
          label="Participation Resume Date"
          description="Applicable only if participation is paused."
          name="dogParticipationResumeDate"
          type="text"
        />

        <div className="mt-6 flex flex-col gap-3 md:flex-row-reverse md:justify-end">
          <BarkButton className="w-full md:w-40" variant="brandInverse">
            Cancel
          </BarkButton>
          <BarkButton className="w-full md:w-40" variant="brand" type="submit">
            Save
          </BarkButton>
        </div>
      </BarkForm>
    </div>
  );
}
