"use client";

import {
  BarkForm,
  BarkFormCheckboxes,
  BarkFormDatetimeInput,
  BarkFormHeader,
  BarkFormInput,
  BarkFormRadioGroup,
  BarkFormSelect,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { Breed } from "@/lib/services/breed";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FORM_SCHEMA = z.object({
  "dog-name": z.string(),
  "dog-breed": z.string(),
  "dog-birthday": z.date(),
  "dog-sex": z.string(),
  "dog-weight": z.string().regex(/^\d+(\.\d+)?$/),
  "dog-blood-type": z.string(),
  "dog-blood-transfusion-status": z.string(),
  "dog-pregnant-status": z.string(),
  "dog-preferred-vets": z.array(z.string()),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function PetForm({
  breeds,
  onSubmitForm,
}: {
  breeds: Breed[];
  onSubmitForm: (values: FormDataType) => void;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      "dog-name": "",
      "dog-preferred-vets": [],
      "dog-weight": "",
    },
  });

  async function onSubmit(values: FormDataType) {
    // ! Send the form data to the server.
    console.log(values);
    onSubmitForm(values);
  }

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormHeader>Tell us about your pet</BarkFormHeader>
        <BarkFormInput
          form={form}
          label="What’s your dog’s name?"
          name="dog-name"
        />

        <BarkFormSelect
          form={form}
          label="What’s your dog’s breed?"
          name="dog-breed"
          options={breeds.map((breed) => ({
            label: breed.dog_breed,
            value: breed.dog_breed,
          }))}
        />

        <BarkFormDatetimeInput
          form={form}
          label="When is it’s birthday? (DD/MM/YYYY)"
          name="dog-birthday"
        />

        <BarkFormRadioGroup
          form={form}
          label="What’s your dog’s sex?"
          name="dog-sex"
          layout="button"
          options={[
            { label: "Yes", value: "yes" },
            {
              label: "No",
              value: "no",
            },
          ]}
        />

        <BarkFormInput
          form={form}
          label="What’s your dog’s weight?"
          name="dog-weight"
          type="number"
        />

        <BarkFormRadioGroup
          form={form}
          label="Do you know it’s blood type?"
          name="dog-blood-type"
          options={[
            { label: "I don't know", value: "idk" },
            {
              label: "D.E.A 1.1 positive",
              value: "dea1.1-positive",
            },
            {
              label: "D.E.A 1.1 negative",
              value: "dea1.1-negative",
            },
          ]}
        />

        <BarkFormRadioGroup
          form={form}
          label="Has it received blood transfusion before?"
          name="dog-blood-transfusion-status"
          layout="button"
          options={[
            { label: "I don't know", value: "idk" },
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
          ]}
        />

        <BarkFormRadioGroup
          form={form}
          label="Has your dog been pregnant before?"
          name="dog-pregnant-status"
          layout="button"
          options={[
            { label: "I don't know", value: "idk" },
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
          ]}
        />

        <BarkFormCheckboxes
          form={form}
          label="Select your preferred vet for blood profiling test and blood donation"
          name="dog-preferred-vets"
          options={[
            { label: "Vet A", value: "vet-a" },
            {
              label: "Vet B",
              value: "vet-b",
            },
            {
              label: "Vet C",
              value: "vet-c",
            },
          ]}
        />
        <BarkFormSubmitButton
          disabled={!form.formState.isValid}
          className="w-full"
        >
          Next
        </BarkFormSubmitButton>
      </BarkForm>
    </>
  );
}
