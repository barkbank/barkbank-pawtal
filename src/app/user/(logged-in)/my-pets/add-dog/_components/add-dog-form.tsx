"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import GeneralDogForm, { DogFormData } from "./general-dog-form";

export default function AddDogForm(props: { vetOptions: BarkFormOption[] }) {
  const { vetOptions } = props;
  async function onSubmit(values: DogFormData) {
    console.log(values);
  }
  return (
    <GeneralDogForm
      formTitle="Add Dog"
      vetOptions={vetOptions}
      onSubmit={onSubmit}
    />
  );
}
