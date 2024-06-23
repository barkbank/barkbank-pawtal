import { BarkFormOption } from "@/components/bark/bark-form";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { SubProfile } from "@/lib/bark/models/sub-profile";
import { Result } from "@/lib/utilities/result";

export function SubProfileForm(props: {
  vetOptions: BarkFormOption[];
  dogProfile: DogProfile;
  handleSubmit: (subProfile: SubProfile) => Promise<Result<true, string>>;
  handleCancel: () => Promise<void>;
}) {
  return <div>SubProfileForm</div>;
}
