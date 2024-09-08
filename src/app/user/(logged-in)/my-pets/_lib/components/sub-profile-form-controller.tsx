"use client";

import { BarkFormOption } from "@/components/bark/bark-form-option";
import { SubProfileForm } from "./sub-profile-form";
import { DogProfile } from "@/lib/bark/models/dog-profile-models";
import { SubProfile } from "@/lib/bark/models/dog-profile-models";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { postSubProfileUpdate } from "../actions/post-sub-profile-update";
import { useToast } from "@/components/ui/use-toast";

export function SubProfileFormController(props: {
  vetOptions: BarkFormOption[];
  dogId: string;
  dogProfile: DogProfile;
  subProfile: SubProfile;
}) {
  const { vetOptions, dogId, dogProfile, subProfile } = props;
  const router = useRouter();
  const { toast } = useToast();

  const onCancel = async () => {
    router.push(RoutePath.USER_VIEW_DOG(dogId));
  };

  const onSubmit = async (
    subProfile: SubProfile,
  ): Promise<Result<true, string>> => {
    const { dogName } = subProfile;
    toast({
      title: "Saving...",
      description: `Profile for ${dogName} is being saved.`,
      variant: "brandInfo",
    });
    const err = await postSubProfileUpdate({ dogId, subProfile });
    if (err === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.USER_LOGIN_PAGE);
      return Err(err);
    }
    if (err !== CODE.OK) {
      return Err(err);
    }
    toast({
      title: "Saved!",
      description: `Profile for ${dogName} has been saved.`,
      variant: "brandSuccess",
    });
    router.push(RoutePath.USER_VIEW_DOG(dogId));
    return Ok(true);
  };

  return (
    <SubProfileForm
      vetOptions={vetOptions}
      dogProfile={dogProfile}
      subProfile={subProfile}
      handleCancel={onCancel}
      handleSubmit={onSubmit}
    />
  );
}
