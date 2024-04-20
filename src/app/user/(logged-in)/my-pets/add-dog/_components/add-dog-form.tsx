"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import GeneralDogForm, {
  DogFormData,
} from "../../_components/general-dog-form";
import { DogProfile } from "@/lib/user/user-models";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";
import { submitDog } from "../_actions/submit-dog";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";

export default function AddDogForm(props: { vetOptions: BarkFormOption[] }) {
  const router = useRouter();
  const { vetOptions } = props;

  async function handleValues(values: DogFormData) {
    const {
      dogBirthday: dogBirthdayString,
      dogWeightKg: dogWeightKgString,
      ...otherFields
    } = values;
    const dogBirthday = parseDateTime(dogBirthdayString, UTC_DATE_OPTION);
    const dogWeightKg = parseFloat(dogWeightKgString);
    const dogProfile: DogProfile = {
      dogBirthday,
      dogWeightKg,
      ...otherFields,
    };
    const { error } = await submitDog(dogProfile);
    if (error) {
      return error;
    }
    router.push(RoutePath.USER_MY_PETS);
    return "";
  }

  return (
    <GeneralDogForm
      formTitle="Add Dog"
      vetOptions={vetOptions}
      handleValues={handleValues}
    />
  );
}
