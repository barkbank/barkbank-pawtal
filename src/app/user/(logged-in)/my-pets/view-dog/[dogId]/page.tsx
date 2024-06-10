import { BarkButton } from "@/components/bark/bark-button";
import { BarkDogAvatar } from "@/components/bark/bark-dog-avatar";
import { BarkStatusBlock } from "@/components/bark/bark-status-block";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { DOG_ANTIGEN_PRESENCE, DogAntigenPresence } from "@/lib/data/db-enums";
import { YES_NO_UNKNOWN, YesNoUnknown } from "@/lib/bark/enums/yes-no";
import { DOG_GENDER, DogGender } from "@/lib/bark/models/dog-gender";
import {
  DogAppointment,
  DogPreferredVet,
  DogProfile,
  DogStatuses,
} from "@/lib/dog/dog-models";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { getDogAppointments } from "@/lib/user/actions/get-dog-appointments";
import { getDogPreferredVet } from "@/lib/user/actions/get-dog-preferred-vet";
import { getDogProfile } from "@/lib/user/actions/get-dog-profile";
import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { UserActor } from "@/lib/user/user-actor";
import { getAgeMonths } from "@/lib/utilities/bark-age";
import { CODE } from "@/lib/utilities/bark-code";
import { UTC_DATE_OPTION, formatDateTime } from "@/lib/utilities/bark-time";
import { Err, Ok, Result } from "@/lib/utilities/result";
import Image from "next/image";
import { redirect } from "next/navigation";

async function getPageData(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    {
      dogProfile: DogProfile;
      dogStatuses: DogStatuses;
      dogAppointments: DogAppointment[];
      dogPreferredVet: DogPreferredVet | null;
    },
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.DB_QUERY_FAILURE
    | typeof CODE.ERROR_MORE_THAN_ONE_PREFERRED_VET
  >
> {
  const [
    resDogProfile,
    resDogStatuses,
    resDogAppointments,
    resDogPreferredVet,
  ] = await Promise.all([
    getDogProfile(actor, dogId),
    getDogStatuses(actor, dogId),
    getDogAppointments(actor, dogId),
    getDogPreferredVet(actor, dogId),
  ]);

  if (resDogProfile.error !== undefined) {
    return Err(resDogProfile.error);
  }
  if (resDogStatuses.error !== undefined) {
    return Err(resDogStatuses.error);
  }
  if (resDogAppointments.error !== undefined) {
    return Err(resDogAppointments.error);
  }
  if (resDogPreferredVet.error !== undefined) {
    return Err(resDogPreferredVet.error);
  }
  return Ok({
    dogProfile: resDogProfile.result,
    dogStatuses: resDogStatuses.result,
    dogAppointments: resDogAppointments.result,
    dogPreferredVet: resDogPreferredVet.result,
  });
}

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
    <div className="-mt-3 flex flex-row items-center justify-center gap-3">
      <Image src={icon} width={16} height={16} alt="Warning Icon" />
      <p className="text-sm italic">{children}</p>
    </div>
  );
}

function formatWeight(dogWeightKg: number | null): string {
  if (dogWeightKg === null) {
    return "Unknown";
  }
  return `${dogWeightKg} KG`;
}

function formatAge(dogAgeMonths: number): string {
  const yearValue = Math.floor(dogAgeMonths / 12);
  const monthValue = dogAgeMonths % 12;
  const yearUnit = yearValue === 1 ? "year" : "years";
  const monthUnit = monthValue === 1 ? "month" : "months";
  return `${yearValue} ${yearUnit} ${monthValue} ${monthUnit}`;
}

function formatGender(dogGender: DogGender): string {
  if (dogGender === DOG_GENDER.MALE) return "Male";
  if (dogGender === DOG_GENDER.FEMALE) return "Female";
  return "Unknown";
}

function formatPregnancyHistory(
  dogGender: DogGender,
  dogEverPregnant: YesNoUnknown,
): string {
  if (dogGender === DOG_GENDER.MALE) {
    return "N.A.";
  }
  if (dogEverPregnant === YES_NO_UNKNOWN.YES) {
    return "Yes, ever pregnant";
  }
  if (dogEverPregnant === YES_NO_UNKNOWN.NO) {
    return "No, never pregnant";
  }
  return "Unknown";
}

function formatBloodType(dogDea1Point1: DogAntigenPresence): string {
  if (dogDea1Point1 === DOG_ANTIGEN_PRESENCE.POSITIVE) {
    return "DEA 1.1 Positive";
  }
  if (dogDea1Point1 === DOG_ANTIGEN_PRESENCE.NEGATIVE) {
    return "DEA 1.1 Negative";
  }
  return "Unknown";
}

function formatTransfusionHistory(
  dogEverReceivedTransfusion: YesNoUnknown,
): string {
  if (dogEverReceivedTransfusion === YES_NO_UNKNOWN.YES) {
    return "Yes, ever received blood transfusion";
  }
  if (dogEverReceivedTransfusion === YES_NO_UNKNOWN.NO) {
    return "No, never received blood transfusion";
  }
  return "Unknown";
}

function formatBirthday(dogBirthday: Date): string {
  return formatDateTime(dogBirthday, UTC_DATE_OPTION);
}

function formatPreferredVet(dogPreferredVet: DogPreferredVet | null): string {
  if (dogPreferredVet === null) {
    return "No preferred vet";
  }
  const { vetName, vetAddress } = dogPreferredVet;
  return `${vetName} (${vetAddress})`;
}

export default async function Page(props: { params: { dogId: string } }) {
  const { dogId } = props.params;
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const { result, error } = await getPageData(actor, dogId);
  if (error !== undefined) {
    redirect(RoutePath.USER_MY_PETS);
  }
  const { dogProfile, dogStatuses, dogAppointments, dogPreferredVet } = result;

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
    <div className="m-3 flex flex-col md:items-start">
      <div className="flex flex-row items-start justify-center gap-3">
        <BarkDogAvatar gender={dogGender} className="align" />
        <div className="flex flex-col items-start justify-center gap-3">
          <h1 className="text-3xl">{dogName}</h1>
          <BarkStatusBlock
            dogName={dogName}
            dogStatuses={dogStatuses}
            dogAppointments={dogAppointments}
          />
        </div>
      </div>
      <div className="mt-3 flex w-full flex-col items-start justify-start gap-3 rounded-md p-3 shadow-md shadow-slate-400">
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

        <div className="flex w-full flex-col gap-3 md:flex-row">
          <BarkButton
            className="w-full md:w-40"
            variant="brandInverse"
            href={RoutePath.USER_MY_PETS}
          >
            Back
          </BarkButton>
          <BarkButton
            className="w-full md:w-40"
            variant="brandInverse"
            href={RoutePath.USER_EDIT_DOG(dogId)}
          >
            Edit
          </BarkButton>
        </div>
      </div>
    </div>
  );
}
