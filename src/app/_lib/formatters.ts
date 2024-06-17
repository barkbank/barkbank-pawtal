import {
  DogAntigenPresence,
  DOG_ANTIGEN_PRESENCE,
} from "@/lib/bark/enums/dog-antigen-presence";
import { DogGender, DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { YesNoUnknown, YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DogPreferredVet } from "@/lib/bark/models/dog-preferred-vet";
import { formatDateTime, SGT_UI_DATE } from "@/lib/utilities/bark-time";

export function formatPreferredVet(
  dogPreferredVet: DogPreferredVet | null,
): string {
  if (dogPreferredVet === null) {
    return "No preferred vet";
  }
  const { vetName, vetAddress } = dogPreferredVet;
  return `${vetName} (${vetAddress})`;
}

export function formatWeight(dogWeightKg: number | null): string {
  if (dogWeightKg === null) {
    return "Unknown";
  }
  return `${dogWeightKg} KG`;
}

export function formatAge(dogAgeMonths: number): string {
  const yearValue = Math.floor(dogAgeMonths / 12);
  const monthValue = dogAgeMonths % 12;
  const yearUnit = yearValue === 1 ? "year" : "years";
  const monthUnit = monthValue === 1 ? "month" : "months";
  return `${yearValue} ${yearUnit} ${monthValue} ${monthUnit}`;
}

export function formatGender(dogGender: DogGender): string {
  if (dogGender === DOG_GENDER.MALE) return "Male";
  if (dogGender === DOG_GENDER.FEMALE) return "Female";
  return "Unknown";
}

export function formatPregnancyHistory(
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

export function formatBloodType(dogDea1Point1: DogAntigenPresence): string {
  if (dogDea1Point1 === DOG_ANTIGEN_PRESENCE.POSITIVE) {
    return "DEA 1.1 Positive";
  }
  if (dogDea1Point1 === DOG_ANTIGEN_PRESENCE.NEGATIVE) {
    return "DEA 1.1 Negative";
  }
  return "Unknown";
}

export function formatTransfusionHistory(
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

export function formatBirthday(dogBirthday: Date): string {
  return formatDateTime(dogBirthday, SGT_UI_DATE);
}
