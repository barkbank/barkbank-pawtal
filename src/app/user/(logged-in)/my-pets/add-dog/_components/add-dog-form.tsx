"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import GeneralDogForm, {
  DogFormData,
} from "../../_components/general-dog-form";
import { MyDogRegistration } from "@/lib/user/user-models";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";

// WIP: Impl addMyDog(UserActor, MyDogRegistration).
// WIP: Impl add-dog server-action to call addMyDog.

export default function AddDogForm(props: { vetOptions: BarkFormOption[] }) {
  const { vetOptions } = props;
  async function onSubmit(values: DogFormData) {
    console.log(values);
    const {
      dogBirthday: dogBirthdayString,
      dogWeightKg: dogWeightKgString,
      ...otherFields
    } = values;
    const dogBirthday = parseDateTime(dogBirthdayString, UTC_DATE_OPTION);
    const dogWeightKg = parseFloat(dogWeightKgString);
    const reg: MyDogRegistration = { dogBirthday, dogWeightKg, ...otherFields };
    console.log(reg);
  }
  return (
    <GeneralDogForm
      formTitle="Add Dog"
      vetOptions={vetOptions}
      onSubmit={onSubmit}
    />
  );
}
