import { BarkFormOption } from "@/components/bark/bark-form";
import { SubProfileForm } from "./sub-profile-form";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { SubProfile } from "@/lib/bark/models/sub-profile";
import { Ok, Result } from "@/lib/utilities/result";

export function SubProfileFormController(props: {
  vetOptions: BarkFormOption[];
  dogId: string;
  existingDogProfile: DogProfile;
}) {
  const { vetOptions, dogId, existingDogProfile } = props;

  const onCancel = async () => {
    console.debug({ _msg: "onCancel was triggered" });
  };

  const onSubmit = async (
    subProfile: SubProfile,
  ): Promise<Result<true, string>> => {
    console.debug({
      _msg: "onSubmit was triggered",
      subProfile,
    });
    return Ok(true);
  };

  return (
    <SubProfileForm
      vetOptions={vetOptions}
      dogProfile={existingDogProfile}
      handleCancel={onCancel}
      handleSubmit={onSubmit}
    />
  );
}
