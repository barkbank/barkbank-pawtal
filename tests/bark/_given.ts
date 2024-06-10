import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import {
  getDogMapper,
  getUserSpec,
  insertDog,
  insertUser,
  insertVet,
  userPii,
} from "../_fixtures";
import { BarkTestContext } from "./_context";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no";
import {
  DOG_GENDER,
  DogGender,
  DogGenderSchema,
} from "@/lib/bark/models/dog-gender";
import { dbQuery } from "@/lib/data/db-utils";
import { BarkContext } from "@/lib/bark/bark-context";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { mockReportData } from "./_mocks";
import {
  BarkReportData,
  BarkReportDataSchema,
} from "@/lib/bark/models/bark-report-data";
import { z } from "zod";
import { toUserPii } from "@/lib/bark/mappers/to-user-pii";

const GivenUserSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
});

type GivenUserType = z.infer<typeof GivenUserSchema>;

export async function givenUser(
  context: BarkTestContext,
  options?: { userIdx?: number },
): Promise<GivenUserType> {
  const { dbPool } = context;
  const args = options ?? {};
  const { userIdx } = args;
  const idx = userIdx ?? 1;
  const { userId } = await insertUser(idx, dbPool);
  const { userName, userEmail, userPhoneNumber } = userPii(idx);
  return { userId, userName, userEmail, userPhoneNumber };
}

async function existingUser(
  context: BarkTestContext,
  userId: string,
): Promise<GivenUserType> {
  const { dbPool } = context;
  const sql = `
  SELECT
    user_encrypted_pii as "userEncryptedPii"
  FROM users
  WHERE user_id = $1
  `;
  const res = await dbQuery<{ userEncryptedPii: string }>(dbPool, sql, [
    userId,
  ]);
  const userEncryptedPii = res.rows[0].userEncryptedPii;
  const flds = await toUserPii(context, userEncryptedPii);
  return { userId, ...flds };
}

const GivenDogSchema = z.object({
  dogId: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  dogGender: DogGenderSchema,
  ownerUserId: z.string(),
  ownerName: z.string(),
});

type GivenDogType = z.infer<typeof GivenDogSchema>;

export async function givenDog(
  context: BarkTestContext,
  options?: { dogIdx?: number; userId?: string; preferredVetId?: string },
): Promise<GivenDogType> {
  const { dbPool } = context;
  const args = options ?? {};
  const { dogIdx, preferredVetId } = args;
  const idx = dogIdx ?? 1;
  const { ownerUserId, ownerName } = await (async () => {
    if (args.userId !== undefined) {
      const { userName } = await existingUser(context, args.userId);
      return {
        ownerUserId: args.userId,
        ownerName: userName,
      };
    }
    const res = await givenUser(context, { userIdx: idx });
    return {
      ownerUserId: res.userId,
      ownerName: res.userName,
    };
  })();
  const { dogId } = await insertDog(idx, ownerUserId, dbPool, {
    dogGender: DOG_GENDER.MALE,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
  });
  if (preferredVetId !== undefined) {
    await dbInsertDogVetPreference(dbPool, dogId, preferredVetId);
  }
  const dogSql = `
  SELECT
    dog_encrypted_oii as "dogEncryptedOii",
    dog_breed as "dogBreed",
    dog_gender as "dogGender"
  FROM dogs
  WHERE dog_id = $1
  `;
  const { dogEncryptedOii, dogBreed, dogGender } = (
    await dbQuery<{
      dogEncryptedOii: string;
      dogBreed: string;
      dogGender: DogGender;
    }>(dbPool, dogSql, [dogId])
  ).rows[0];
  const { dogName } = await getDogMapper().mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  return { dogId, dogName, dogBreed, dogGender, ownerUserId, ownerName };
}

const GivenVetSchema = z.object({
  vetId: z.string(),
});

type GivenVetType = z.infer<typeof GivenVetSchema>;

export async function givenVet(
  context: BarkTestContext,
  options?: { vetIdx?: number },
): Promise<GivenVetType> {
  const { dbPool } = context;
  const { vetIdx } = options ?? {};
  const { vetId } = await insertVet(vetIdx ?? 1, dbPool);
  return { vetId };
}

const GivenAppointmentSchema = z
  .object({
    appointmentId: z.string(),
  })
  .merge(GivenVetSchema)
  .merge(GivenDogSchema);

type GivenAppointmentType = z.infer<typeof GivenAppointmentSchema>;

export async function givenAppointment(
  context: BarkContext,
  options?: { idx?: number; existingVetId?: string },
): Promise<GivenAppointmentType> {
  const { idx, existingVetId } = options ?? {};
  const vetId =
    existingVetId ?? (await givenVet(context, { vetIdx: idx })).vetId;
  const theDog = await givenDog(context, {
    dogIdx: idx,
    preferredVetId: vetId,
  });
  const a1 = await opRecordAppointmentCallOutcome(context, {
    dogId: theDog.dogId,
    vetId,
  });
  const appointmentId = a1.result!.appointmentId;
  const result: GivenAppointmentType = { appointmentId, vetId, ...theDog };
  return GivenAppointmentSchema.parse(result);
}

const GivenReportSchema = z
  .object({
    reportId: z.string(),
    reportData: BarkReportDataSchema,
  })
  .merge(GivenAppointmentSchema);

type GivenReportType = z.infer<typeof GivenReportSchema>;

export async function givenReport(
  context: BarkContext,
  options?: { idx?: number; existingVetId?: string },
): Promise<GivenReportType> {
  const res1 = await givenAppointment(context, options);
  const reportData = mockReportData();
  const res2 = await opSubmitReport(context, {
    appointmentId: res1.appointmentId,
    actorVetId: res1.vetId,
    reportData,
  });
  const reportId = res2.result!.reportId;
  const result: GivenReportType = { reportId, reportData, ...res1 };
  return GivenReportSchema.parse(result);
}
