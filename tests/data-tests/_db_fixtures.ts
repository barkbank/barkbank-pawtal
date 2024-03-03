import {
  UserSpec,
  AdminSpec,
  VetSpec,
  DogSpec,
  DogAntigenPresence,
  DogGender,
  DogStatus,
  YesNoUnknown,
} from "@/lib/data/db-models";
import { sprintf } from "sprintf-js";

export function ensureTimePassed(): void {
  const t0 = new Date().getTime();
  let t1 = new Date().getTime();
  while (t0 === t1) {
    t1 = new Date().getTime();
  }
}
export function userSpec(idx: number): UserSpec {
  return {
    userHashedEmail: hashedEmail(idx),
    userEncryptedPii: encryptedPii(idx),
  };
}
export function adminSpec(idx: number): AdminSpec {
  return {
    adminHashedEmail: hashedEmail(idx),
    adminEncryptedPii: encryptedPii(idx),
  };
}
export function vetSpec(idx: number): VetSpec {
  return {
    vetEmail: email(idx),
    vetName: `Vet${idx}`,
    vetPhoneNumber: phoneNumber(idx),
    vetAddress: `1${idx} Jalan Mango`,
  };
}
export function dogSpec(idx: number): DogSpec {
  return {
    dogStatus: dogStatus(idx),
    dogEncryptedOii: `dogEncryptedOii-${idx}`,
    dogBreed: `dogBreed${idx}`,
    dogBirthday: birthday(idx),
    dogGender: dogGender(idx),
    dogWeightKg: dogWeightKg(idx),
    dogDea1Point1: dogAntigenPresence(idx + 1 + 1),
    dogEverPregnant: dogEverPregnant(idx),
    dogEverReceivedTransfusion: yesNoUnknown(idx),
  };
}
function birthday(idx: number): string {
  const baseYear = 2023;
  const yearOffset = idx % 5;
  const year = baseYear - yearOffset;
  const monthOfYear = idx % 13;
  const dayOfMonth = idx % 29;
  return sprintf("%d-%02d-%02d", year, monthOfYear, dayOfMonth);
}
function dogAntigenPresence(idx: number): DogAntigenPresence {
  const presenceList: DogAntigenPresence[] = Object.values(DogAntigenPresence);
  return presenceList[idx % presenceList.length];
}
function dogGender(idx: number): DogGender {
  const genderList: DogGender[] = Object.values(DogGender);
  return genderList[idx % genderList.length];
}
function dogWeightKg(idx: number): number | null {
  const options: (number | null)[] = [null, 6, 12, 17, 22, 26, 31, 38];
  return options[idx % options.length];
}
function dogStatus(idx: number): DogStatus {
  const statusList: DogStatus[] = Object.values(DogStatus);
  return statusList[idx % statusList.length];
}
function yesNoUnknown(idx: number): YesNoUnknown {
  const responseList: YesNoUnknown[] = Object.values(YesNoUnknown);
  return responseList[idx % responseList.length];
}
function dogEverPregnant(idx: number): YesNoUnknown {
  const gender = dogGender(idx);
  if (gender === DogGender.MALE) {
    return YesNoUnknown.NO;
  }
  if (gender === DogGender.UNKNOWN) {
    return YesNoUnknown.UNKNOWN;
  }
  return yesNoUnknown(idx);
}
function encryptedPii(idx: number): string {
  return `encryptedPii(${idx})`;
}
function hashedEmail(idx: number): string {
  return `hashed(${email(idx)})`;
}
function email(idx: number): string {
  return `user${idx}@system.com`;
}
function phoneNumber(idx: number): string {
  return (90001000 + idx).toString();
}
