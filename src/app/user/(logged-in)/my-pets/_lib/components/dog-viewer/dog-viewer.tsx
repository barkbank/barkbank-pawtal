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
import { BarkButton } from "@/components/bark/bark-button";
import { BarkDogAvatar } from "@/components/bark/bark-dog-avatar";
import { BarkStatusBlock } from "@/components/bark/bark-status-block";
import { Separator } from "@/components/ui/separator";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { getAgeMonths } from "@/lib/utilities/bark-age";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DogViewerData } from "./dog-viewer-data";

function ProfileItem(props: { label: string; value: string | number | null }) {
  const { label, value } = props;
  return (
    <div className="w-full">
      <h2 className="text-base">{label}:</h2>
      <p className="flex-1 text-base font-bold">{value}</p>
    </div>
  );
}

function Warning(props: { children: React.ReactNode; icon: string }) {
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

export function DogViewer(props: { data: DogViewerData }) {
  const { data } = props;
  const { dogId, dogProfile, dogStatuses, dogAppointments, dogPreferredVet } =
    data;
  const {
    dogName,
    dogGender,
    dogBreed,
    dogWeightKg,
    dogBirthday,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogDea1Point1,
  } = dogProfile;

  const dogAgeMonths = getAgeMonths(dogBirthday, new Date());

  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="x-card flex flex-row gap-3">
        <BarkDogAvatar
          gender={dogGender}
          className="h-16 w-16 md:h-24 md:w-24"
        />
        <div className="flex flex-col items-start justify-center gap-3">
          <h1 className="text-3xl">{dogName}</h1>
          <BarkStatusBlock
            dogName={dogName}
            dogStatuses={dogStatuses}
            dogAppointments={dogAppointments}
          />
        </div>
      </div>
      <div className="x-card flex w-full flex-col gap-3">
        <div className="flex flex-row justify-between">
          <p className="x-card-title">Profile</p>
          <Link href={RoutePath.USER_EDIT_DOG(dogId)}>
            <Edit color="#555" />
          </Link>
        </div>
        <Separator />
        <ProfileItem label="Breed" value={dogBreed} />
        <ProfileItem label="Weight" value={formatWeight(dogWeightKg)} />
        {dogBreed === "" && dogWeightKg === null && (
          <Warning icon={IMG_PATH.CIRCLE_RED_EXCLAMATION}>
            Either dog breed or weight must be specified to complete the
            profile.
          </Warning>
        )}
        {dogWeightKg !== null && dogWeightKg < 20 && (
          <Warning icon={IMG_PATH.CIRCLE_BLUE_PAUSE}>
            Dogs weighing under 20 KG are not eligible.
          </Warning>
        )}

        <ProfileItem label="Sex" value={formatGender(dogGender)} />
        <ProfileItem label="Birthday" value={formatBirthday(dogBirthday)} />
        <ProfileItem label="Age" value={formatAge(dogAgeMonths)} />
        {dogAgeMonths < 12 && (
          <Warning icon={IMG_PATH.CIRCLE_BLUE_PAUSE}>
            Dogs younger than 1 year of age are not eligible.
          </Warning>
        )}
        {dogAgeMonths >= 8 * 12 && (
          <Warning icon={IMG_PATH.CIRCLE_GREY_CROSS}>
            Dogs aged 8 years or older are ineligible.
          </Warning>
        )}
        <ProfileItem
          label="Blood Type"
          value={formatBloodType(dogDea1Point1)}
        />
        <ProfileItem
          label="Ever Pregnant"
          value={formatPregnancyHistory(dogGender, dogEverPregnant)}
        />
        {dogEverPregnant === YES_NO_UNKNOWN.YES && (
          <Warning icon={IMG_PATH.CIRCLE_GREY_CROSS}>
            Dogs that have a history of pregnancy are not eligible.
          </Warning>
        )}
        <ProfileItem
          label="Ever Received Blood"
          value={formatTransfusionHistory(dogEverReceivedTransfusion)}
        />
        {dogEverReceivedTransfusion === YES_NO_UNKNOWN.YES && (
          <Warning icon={IMG_PATH.CIRCLE_GREY_CROSS}>
            Dogs that have undergone a blood transfusion at any point are not
            eligible.
          </Warning>
        )}

        <ProfileItem
          label="Preferred Vet"
          value={formatPreferredVet(dogPreferredVet)}
        />
      </div>

      <BarkButton
        className="w-full md:w-40"
        variant="brandInverse"
        href={RoutePath.USER_MY_PETS}
      >
        Back to Pets
      </BarkButton>
    </div>
  );
}
