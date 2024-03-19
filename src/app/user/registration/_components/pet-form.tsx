"use client";

import {
  BarkForm,
  BarkFormButton,
  BarkFormDateInput,
  BarkFormHeader,
  BarkFormInput,
  BarkFormOption,
  BarkFormRadioGroup,
  BarkFormSelect,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { isValidWeightKg } from "@/lib/bark-utils";
import {
  DogAntigenPresence,
  DogGender,
  YesNoUnknown,
} from "@/lib/data/db-models";
import { Breed } from "@/lib/services/breed";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FORM_SCHEMA = z.object({
  dogName: z.string().min(1, { message: "Name cannot be empty" }),
  dogBreed: z.string(),
  dogBirthday: z.string().min(1, { message: "Please fill in a birthday" }),
  dogGender: z.string().min(1, { message: "Please select an option" }),
  dogWeightKg: z.string().refine(isValidWeightKg, {
    message: "Weight should be a positive whole number or left blank",
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

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormHeader>Tell us about your pet</BarkFormHeader>

        <BarkFormInput
          form={form}
          label="What's your dog's name?"
          name="dogName"
        />

        {/* TODO: Make better autocomplete before using. */}
        {/* <BarkFormSelect
          form={form}
          label="What's your dog's breed?"
          name="dogBreed"
          options={breeds.map((breed) => ({
            label: breed.dog_breed,
            value: breed.dog_breed,
          }))}
        /> */}

        <BarkFormInput
          form={form}
          label="What's your dog's breed?"
          name="dogBreed"
          type="text"
        />

        <BarkFormDateInput
          form={form}
          label="When is it's birthday? (YYYY-MM-DD)"
          name="dogBirthday"
        />

        <BarkFormRadioGroup
          form={form}
          label="What's your dog's sex?"
          name="dogGender"
          layout="button"
          options={[
            { label: "Male", value: DogGender.MALE },
            { label: "Female", value: DogGender.FEMALE },
          ]}
        />

        <BarkFormInput
          form={form}
          label="What's your dog's weight? (KG)"
          description="Provide whole number weight or leave blank if unknown"
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
              value: DogAntigenPresence.UNKNOWN,
            },
            {
              label: "D.E.A 1.1 positive",
              value: DogAntigenPresence.POSITIVE,
            },
            {
              label: "D.E.A 1.1 negative",
              value: DogAntigenPresence.NEGATIVE,
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
              value: YesNoUnknown.UNKNOWN,
            },
            {
              label: "Yes",
              value: YesNoUnknown.YES,
            },
            {
              label: "No",
              value: YesNoUnknown.NO,
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
              value: YesNoUnknown.UNKNOWN,
            },
            {
              label: "Yes",
              value: YesNoUnknown.YES,
            },
            {
              label: "No",
              value: YesNoUnknown.NO,
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

        <div className="flex gap-2">
          <BarkFormButton onClick={onPrevClick} className="w-full">
            {prevLabel}
          </BarkFormButton>

          <BarkFormSubmitButton className="w-full">
            {nextLabel}
          </BarkFormSubmitButton>
        </div>
      </BarkForm>
    </>
  );
}
