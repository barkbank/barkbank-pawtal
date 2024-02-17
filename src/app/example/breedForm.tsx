"use client";

import {
  BarkForm,
  BarkFormHeader,
  BarkFormSelect,
} from "@/components/bark/bark-form";
import { Breed } from "@/services/breedService";
import { useForm } from "react-hook-form";

export default function BreedForm({ breeds }: { breeds: Breed[] }) {
  const form = useForm<FormData>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BarkForm
        onSubmit={async (data) => {
          console.log(data);
        }}
        form={form}
      >
        <BarkFormHeader>Dog Breeds</BarkFormHeader>
        <BarkFormSelect
          form={form}
          label="Breed"
          name="select-breed"
          options={breeds.map((breed) => ({
            label: breed.dog_breed,
            value: breed.dog_breed,
          }))}
          description="this is some description"
        />
      </BarkForm>
    </main>
  );
}
