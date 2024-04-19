"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import GeneralDogForm, {
  DogFormData,
} from "../../_components/general-dog-form";

// WIP: Impl addMyDogRegistration(UserActor, MyDogRegistration).
// WIP: Impl add-dog server-action to call addMyDogRegistration.

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
