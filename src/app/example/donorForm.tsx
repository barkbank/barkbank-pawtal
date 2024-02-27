"use client";

import {
  BarkForm,
  BarkFormCheckboxes,
  BarkFormHeader,
  BarkFormInput,
  BarkFormRadioGroup,
  BarkFormSelect,
} from "@/components/bark/bark-form";
import { Breed } from "@/lib/services/breed";
import { useForm } from "react-hook-form";

export default function DonorForm({ breeds }: { breeds: Breed[] }) {
  const form = useForm<FormData>();

  return (
    <BarkForm
      onSubmit={async (data) => {
        console.log(data);
      }}
      form={form}
    >
      {/* Owner's detail */}
      <BarkFormHeader>Owners Detail</BarkFormHeader>
      <BarkFormInput
        form={form}
        label="How would you like to be addressed?"
        name="name"
      />
      <BarkFormInput
        form={form}
        label="What number can we reach you on?"
        name="mobile"
      />
      <BarkFormInput
        form={form}
        label="What’s your email address?"
        name="email"
        type="email"
      />

      <BarkFormRadioGroup
        form={form}
        label="Are you currently based in Singapore?"
        name="country-based"
        options={[
          { label: "Yes", value: "yes" },
          {
            label: "No",
            value: "no",
          },
        ]}
      />
      {/* Owner's detail end */}

      {/* Dog's detail */}
      <BarkFormHeader>Dogs Details</BarkFormHeader>
      <BarkFormInput
        form={form}
        label="What’s your dog’s name?"
        name="dog-name"
      />

      <BarkFormSelect
        form={form}
        label="What’s your dog’s breed?"
        name="dof-breed"
        options={breeds.map((breed) => ({
          label: breed.dog_breed,
          value: breed.dog_breed,
        }))}
      />

      {/* Need to have regex to format, in zod as well */}
      <BarkFormInput
        form={form}
        label="When is it’s birthday? (MMYYYY)"
        name="dog-birthday"
      />

      <BarkFormRadioGroup
        form={form}
        label="What’s your dog’s sex?"
        name="dog-sex"
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

      <BarkFormInput
        form={form}
        label="When was it’s last heartworm vaccination? (YYMMYYYY)"
        name="dog-last-heartworm-vaccination"
        description="If applicable"
      />

      <BarkFormInput
        form={form}
        label="When was it’s last blood donation? (YYMMYYYY)"
        name="dog-last-donation"
        description="If applicable"
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
    </BarkForm>
  );
}
