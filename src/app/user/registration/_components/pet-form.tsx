"use client";

import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormHeader } from "@/components/bark/bark-form-typography";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { BarkFormRadioGroup } from "@/components/bark/bark-form-radio-group";
import { BarkFormOption } from "@/components/bark/bark-form-option";
import { isValidWeightKg } from "@/lib/utilities/bark-utils";
import { DOG_ANTIGEN_PRESENCE } from "@/lib/bark/enums/dog-antigen-presence";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";
import { BarkButton } from "@/components/bark/bark-button";
import { useEffect } from "react";
import { BarkFormAutocomplete } from "@/components/bark/bark-form-autocomplete";

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
  breeds: string[];
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
    resolver: zodResolver(FORM_SCHEMA),
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

  const currentValues = form.watch();
  const { dogBreed, dogGender } = currentValues;
  useEffect(() => {
    if (dogGender === DOG_GENDER.MALE) {
      form.setValue("dogEverPregnant", YES_NO_UNKNOWN.NO);
    }
  }, [dogGender, form]);

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormHeader>Tell us about your pet</BarkFormHeader>

        <BarkFormInput form={form} label="Dog Name" name="dogName" />

        <BarkFormAutocomplete
          form={form}
          label="Dog Breed"
          name="dogBreed"
          suggestions={breeds}
          value={dogBreed}
        />

        <BarkFormInput
          form={form}
          label="Dog Birthday"
          name="dogBirthday"
          placeholder="DD MMM YYYY"
          description="Please enter a date in DD MMM YYYY format. E.g. 28 Apr 2022. It is okay to provide an approximate date."
        />

        <BarkFormRadioGroup
          form={form}
          label="Dog Gender"
          name="dogGender"
          layout="button"
          options={[
            { label: "Male", value: DOG_GENDER.MALE },
            { label: "Female", value: DOG_GENDER.FEMALE },
          ]}
        />

        <BarkFormInput
          form={form}
          label="Dog Weight"
          description="Provide weight in KG (leave blank if unknown)"
          name="dogWeightKg"
          type="text"
        />

        <BarkFormRadioGroup
          form={form}
          label="Dog Blood Type"
          name="dogDea1Point1"
          options={[
            {
              label: "I don't know",
              value: DOG_ANTIGEN_PRESENCE.UNKNOWN,
            },
            {
              label: "D.E.A 1.1 Positive",
              value: DOG_ANTIGEN_PRESENCE.POSITIVE,
            },
            {
              label: "D.E.A 1.1 Negative",
              value: DOG_ANTIGEN_PRESENCE.NEGATIVE,
            },
          ]}
        />

        <BarkFormRadioGroup
          form={form}
          label="Has your dog ever received a blood transfusion?"
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
          label="Has your dog ever been pregnant?"
          name="dogEverPregnant"
          layout="button"
          disabled={dogGender === DOG_GENDER.MALE}
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

        {vetOptions.length > 0 && (
          <BarkFormRadioGroup
            form={form}
            label="Select your preferred vet for blood profiling test and donation"
            name="dogPreferredVetId"
            options={vetOptions}
          />
        )}

        <div className="mt-3 flex gap-3">
          <BarkButton
            variant="brandInverse"
            onClick={onPrevClick}
            className="w-full"
            type="button"
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
