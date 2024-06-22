"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { postDogProfileUpdate } from "../actions/post-dog-profile-update";
import { CODE } from "@/lib/utilities/bark-code";
import { GeneralDogForm } from "./general-dog-form";
import { useToast } from "@/components/ui/use-toast";
import { MINIMUM_TOAST_MILLIS } from "@/app/_lib/toast-delay";
import { asyncSleep } from "@/lib/utilities/async-sleep";

export function EditDogProfileFormController(props: {
  vetOptions: BarkFormOption[];
  dogId: string;
  existingDogProfile: DogProfile;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { vetOptions, dogId, existingDogProfile } = props;

  async function handleValues(
    dogProfile: DogProfile,
  ): Promise<Result<true, string>> {
    const { dogName } = dogProfile;

    toast({
      title: "Saving...",
      description: `Profile for ${dogName} is being saved.`,
      variant: "brandInfo",
    });
    const [res, _] = await Promise.all([
      postDogProfileUpdate({ dogId, dogProfile }),
      asyncSleep(MINIMUM_TOAST_MILLIS),
    ]);
    if (res === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.USER_LOGIN_PAGE);
      return Err(res);
    }
    if (res !== CODE.OK) {
      return Err(res);
    }
    toast({
      title: "Saved!",
      description: `Profile for ${dogName} has been saved.`,
      variant: "brandSuccess",
    });
    router.push(RoutePath.USER_VIEW_DOG(dogId));
    return Ok(true);
  }

  async function handleCancel() {
    router.push(RoutePath.USER_VIEW_DOG(dogId));
  }

  return (
    <GeneralDogForm
      formTitle="Edit Dog"
      vetOptions={vetOptions}
      handleSubmit={handleValues}
      handleCancel={handleCancel}
      prefillData={existingDogProfile}
    />
  );
}
