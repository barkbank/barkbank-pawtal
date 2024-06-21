import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import {
  getVetSpec,
  insertDog,
  insertUser,
  insertVet,
  userPii,
} from "../_fixtures";
import {
  SpecifiedDogGender,
  SpecifiedDogGenderSchema,
} from "@/lib/bark/enums/dog-gender";
import { dbQuery } from "@/lib/data/db-utils";
import { BarkContext } from "@/lib/bark/bark-context";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { mockEligibleDogOverrides, mockReportData } from "./_mocks";
import {
  BarkReportData,
  BarkReportDataSchema,
} from "@/lib/bark/models/bark-report-data";
import { z } from "zod";
import { toUserPii } from "@/lib/bark/mappers/to-user-pii";
import { DogSpec } from "@/lib/data/db-models";
import { toDogName } from "@/lib/bark/mappers/to-dog-name";

const GivenUserSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
});

type GivenUserType = z.infer<typeof GivenUserSchema>;

export async function givenUser(
  context: BarkContext,
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

// TODO: Each givenFoo should accept existingFooId and resolve that.
async function existingUser(
  context: BarkContext,
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
  dogGender: SpecifiedDogGenderSchema,
  ownerUserId: z.string(),
  ownerName: z.string(),
});

type GivenDogType = z.infer<typeof GivenDogSchema>;

export async function givenDog(
  context: BarkContext,
  options?: {
    dogIdx?: number;
    userId?: string;
    preferredVetId?: string;
    dogOverrides?: Partial<DogSpec>;
    dogProfileModificationTime?: Date;
  },
): Promise<GivenDogType> {
  const { dbPool } = context;
  const args = options ?? {};
  const { dogIdx, preferredVetId, dogOverrides, dogProfileModificationTime } =
    args;
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
  const baseDogOverrides = mockEligibleDogOverrides();
  const { dogId } = await insertDog(idx, ownerUserId, dbPool, {
    ...baseDogOverrides,
    ...dogOverrides,
  });
  if (dogProfileModificationTime !== undefined) {
    const _sql = `
    UPDATE dogs
    SET profile_modification_time = $2
    WHERE dog_id = $1
    `;
    await dbQuery(dbPool, _sql, [dogId, dogProfileModificationTime]);
  }
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
      dogGender: SpecifiedDogGender;
    }>(dbPool, dogSql, [dogId])
  ).rows[0];
  const dogName = await toDogName(context, dogEncryptedOii);
  return { dogId, dogName, dogBreed, dogGender, ownerUserId, ownerName };
}

const GivenVetSchema = z.object({
  vetId: z.string(),
  vetName: z.string(),
  vetPhoneNumber: z.string(),
  vetAddress: z.string(),
});

type GivenVetType = z.infer<typeof GivenVetSchema>;

export async function givenVet(
  context: BarkContext,
  options?: { vetIdx?: number; existingVetId?: string },
): Promise<GivenVetType> {
  const { dbPool } = context;
  const { vetIdx, existingVetId } = options ?? {};
  if (existingVetId !== undefined) {
    const sql = `
    SELECT
      vet_id as "vetId",
      vet_name as "vetName",
      vet_phone_number as "vetPhoneNumber",
      vet_address as "vetAddress"
    FROM vets
    WHERE vet_id = $1
    `;
    const res = await dbQuery(dbPool, sql, [existingVetId]);
    return GivenVetSchema.parse(res.rows[0]);
  } else {
    const idx = vetIdx ?? 1;
    const { vetId } = await insertVet(idx, dbPool);
    const { vetName, vetPhoneNumber, vetAddress } = getVetSpec(idx);
    return { vetId, vetName, vetPhoneNumber, vetAddress };
  }
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
  options?: {
    idx?: number;
    existingVetId?: string;
    dogOverrides?: Partial<DogSpec>;
    dogProfileModificationTime?: Date;
  },
): Promise<GivenAppointmentType> {
  const { idx, existingVetId, ...otherOptions } = options ?? {};
  const theVet = await givenVet(context, { vetIdx: idx, existingVetId });
  const theDog = await givenDog(context, {
    dogIdx: idx,
    preferredVetId: theVet.vetId,
    ...otherOptions,
  });
  const a1 = await opRecordAppointmentCallOutcome(context, {
    dogId: theDog.dogId,
    vetId: theVet.vetId,
  });
  const appointmentId = a1.result!.appointmentId;
  const result: GivenAppointmentType = { appointmentId, ...theVet, ...theDog };
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
  options?: {
    idx?: number;
    existingVetId?: string;
    dogOverrides?: Partial<DogSpec>;
    dogProfileModificationTime?: Date;
    reportOverrides?: Partial<BarkReportData>;
  },
): Promise<GivenReportType> {
  const { reportOverrides, ...otherOptions } = options ?? {};
  const res1 = await givenAppointment(context, otherOptions);
  const reportData = {
    ...mockReportData(),
    ...reportOverrides,
  };
  const res2 = await opSubmitReport(context, {
    appointmentId: res1.appointmentId,
    actorVetId: res1.vetId,
    reportData,
  });
  const reportId = res2.result!.reportId;
  const result: GivenReportType = { reportId, reportData, ...res1 };
  return GivenReportSchema.parse(result);
}
