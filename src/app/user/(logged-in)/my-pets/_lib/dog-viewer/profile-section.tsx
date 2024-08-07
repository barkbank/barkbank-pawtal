import {
  formatWeight,
  formatGender,
  formatBirthday,
  formatAge,
  formatBloodType,
  formatPregnancyHistory,
  formatTransfusionHistory,
} from "@/app/_lib/formatters";
import { formatPreferredVet } from "@/app/_lib/formatters";
import { Separator } from "@/components/ui/separator";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { DogViewerData } from "./dog-viewer-data";
import Image from "next/image";
import { getAgeMonths } from "@/lib/utilities/bark-age";
import { DataItem } from "./data-item";
import { BarkEditLink } from "@/components/bark/bark-edit-link";

export function ProfileSection(props: { data: DogViewerData }) {
  const { data } = props;
  const { dogId, dogProfile, dogPreferredVet } = data;
  const {
    dogBreed,
    dogWeightKg,
    dogGender,
    dogBirthday,
    dogDea1Point1,
    dogEverPregnant,
    dogEverReceivedTransfusion,
  } = dogProfile;
  const dogAgeMonths = getAgeMonths(dogBirthday, new Date());
  return (
    <div className="x-card flex w-full flex-col gap-3">
      <div className="flex flex-row justify-between">
        <p className="x-card-title">Profile</p>
        <BarkEditLink href={RoutePath.USER_EDIT_DOG(dogId)} />
      </div>
      <Separator />
      <DataItem label="Breed" value={dogBreed} />
      <DataItem label="Weight" value={formatWeight(dogWeightKg)} />
      {dogBreed === "" && dogWeightKg === null && (
        <_Warn icon={IMG_PATH.CIRCLE_RED_EXCLAMATION}>
          Either dog breed or weight must be specified to complete the profile.
        </_Warn>
      )}
      {dogWeightKg !== null && dogWeightKg < 20 && (
        <_Warn icon={IMG_PATH.CIRCLE_BLUE_PAUSE}>
          Dogs weighing under 20 KG are not eligible.
        </_Warn>
      )}

      <DataItem label="Sex" value={formatGender(dogGender)} />
      <DataItem label="Birthday" value={formatBirthday(dogBirthday)} />
      <DataItem label="Age" value={formatAge(dogAgeMonths)} />
      {dogAgeMonths < 12 && (
        <_Warn icon={IMG_PATH.CIRCLE_BLUE_PAUSE}>
          Dogs younger than 1 year of age are not eligible.
        </_Warn>
      )}
      {dogAgeMonths >= 8 * 12 && (
        <_Warn icon={IMG_PATH.CIRCLE_GREY_CROSS}>
          Dogs aged 8 years or older are ineligible.
        </_Warn>
      )}
      <DataItem label="Blood Type" value={formatBloodType(dogDea1Point1)} />
      <DataItem
        label="Ever Pregnant"
        value={formatPregnancyHistory(dogGender, dogEverPregnant)}
      />
      {dogEverPregnant === YES_NO_UNKNOWN.YES && (
        <_Warn icon={IMG_PATH.CIRCLE_GREY_CROSS}>
          Dogs that have a history of pregnancy are not eligible.
        </_Warn>
      )}
      <DataItem
        label="Ever Received Blood"
        value={formatTransfusionHistory(dogEverReceivedTransfusion)}
      />
      {dogEverReceivedTransfusion === YES_NO_UNKNOWN.YES && (
        <_Warn icon={IMG_PATH.CIRCLE_GREY_CROSS}>
          Dogs that have undergone a blood transfusion at any point are not
          eligible.
        </_Warn>
      )}

      <DataItem
        label="Preferred Vet"
        value={formatPreferredVet(dogPreferredVet)}
      />
    </div>
  );
}

function _Warn(props: { children: React.ReactNode; icon: string }) {
  const { children, icon } = props;

  // Note: -mt-3 because warnings are outside the profile item. It should match
  // the gap of the flex-col
  return (
    <div className="-mt-3 flex flex-row gap-3">
      <Image src={icon} width={16} height={16} alt="Warning Icon" />
      <p className="text-sm italic">{children}</p>
    </div>
  );
}
