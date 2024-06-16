"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import { DogProfile } from "@/lib/dog/dog-models";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { postDogProfileUpdate } from "../_actions/post-dog-profile-update";
import { CODE } from "@/lib/utilities/bark-code";
import { GeneralDogForm } from "../../../_lib/components/general-dog-form";
import { useToast } from "@/components/ui/use-toast";
import { MINIMUM_TOAST_MILLIS } from "@/app/_lib/toast-delay";
import { asyncSleep } from "@/lib/utilities/async-sleep";

export default function EditDogProfileForm(props: {
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
    // TODO: do not use router.back(). It may go to the wrong place. Think of another solution.
    router.back();
    return Ok(true);
  }

  async function handleCancel() {
    router.back();
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
