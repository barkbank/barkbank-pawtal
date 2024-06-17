"use client";

import {
  BarkForm,
  BarkFormHeader,
  BarkFormInput,
  BarkFormOption,
  BarkFormRadioGroup,
} from "@/components/bark/bark-form";
import { isValidWeightKg } from "@/lib/utilities/bark-utils";
import { DOG_ANTIGEN_PRESENCE } from "@/lib/bark/enums/dog-antigen-presence";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { Breed } from "@/lib/services/breed";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";
import { BarkButton } from "@/components/bark/bark-button";

const FORM_SCHEMA = z.object({
  dogName: z.string().min(1, { message: "Name cannot be empty" }),
  dogBreed: z.string(),
  dogBirthday: RequiredDateField.new().schema(),
  dogGender: z.string().min(1, { message: "Please select an option" }),
  dogWeightKg: z.string().refine(isValidWeightKg, {
    message: "Weight should be a positive number or left blank",
  }),
  dogDea1Point1: z.string().min(1, { message: "Please select an option" }),
  dogEverReceivedTransfusion: z
    .string()
    .min(1, { message: "Please select an option" }),
  dogEverPregnant: z.string().min(1, { message: "Please select an option" }),
  dogPreferredVetId: z.string().optional(),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function PetForm(props: {
  breeds: Breed[];
  vetOptions: BarkFormOption[];
  defaultValues: FormDataType;
  onSave: (values: FormDataType) => void;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}) {
  const {
    breeds,
    vetOptions,
    defaultValues,
    onSave,
    onPrev,
    onNext,
    prevLabel,
    nextLabel,
  } = props;
  const form = useForm<FormDataType>({
    resolver: zodResolver(
      FORM_SCHEMA.extend({
        // Only if there are more than 1 vet options, we require the user to select one. Else vet will be predetermine.
        dogPreferredVetId:
          vetOptions.length <= 1
            ? FORM_SCHEMA.shape.dogPreferredVetId
            : z.string().min(1, { message: "Please select an option" }),
      }),
    ),
    defaultValues,
  });

  async function onSubmit(values: FormDataType) {
    console.log(values);
    onSave(values);
    onNext();
  }

  async function onPrevClick() {
    onSave(form.getValues());
    onPrev();
  }

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormHeader>Tell us about your pet</BarkFormHeader>

        <BarkFormInput
          form={form}
          label="What's your dog's name?"
          name="dogName"
        />

        {/* TODO: Support auto-complete */}
        <BarkFormInput
          form={form}
          label="What's your dog's breed?"
          name="dogBreed"
          type="text"
        />

        <BarkFormInput
          form={form}
          label="When is it's birthday?"
          name="dogBirthday"
          description="Please provide a date (e.g. 18 Aug 2018). It is okay to provide an approximate date."
        />

        <BarkFormRadioGroup
          form={form}
          label="What's your dog's sex?"
          name="dogGender"
          layout="button"
          options={[
            { label: "Male", value: DOG_GENDER.MALE },
            { label: "Female", value: DOG_GENDER.FEMALE },
          ]}
        />

        <BarkFormInput
          form={form}
          label="What's your dog's weight? (KG)"
          description="Provide weight or leave blank if unknown"
          name="dogWeightKg"
          type="text"
        />

        <BarkFormRadioGroup
          form={form}
          label="Do you know it's blood type?"
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
          label="Has it received blood transfusion before?"
          name="dogEverReceivedTransfusion"
          layout="button"
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
          label="Has your dog been pregnant before?"
          name="dogEverPregnant"
          layout="button"
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
            label="Select your preferred vet for blood profiling test and blood donation"
            name="dogPreferredVetId"
            options={vetOptions}
          />
        )}

        <div className="mt-3 flex gap-3">
          <BarkButton
            variant="brandInverse"
            onClick={onPrevClick}
            className="w-full"
          >
            {prevLabel}
          </BarkButton>

          <BarkButton variant="brand" type="submit" className="w-full">
            {nextLabel}
          </BarkButton>
        </div>
      </BarkForm>
    </>
  );
}
