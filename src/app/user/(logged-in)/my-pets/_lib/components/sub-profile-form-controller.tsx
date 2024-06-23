import { BarkFormOption } from "@/components/bark/bark-form";
import { SubProfileForm } from "./sub-profile-form";
import { DogProfile } from "@/lib/bark/models/dog-profile";

export function SubProfileFormController(props: {
  vetOptions: BarkFormOption[];
  dogId: string;
  existingDogProfile: DogProfile;
}) {
  return <SubProfileForm />;
}
