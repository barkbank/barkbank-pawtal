import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { ReEncryptResult, ReEncryptTableInfo } from "../models/re-encrypt-result";
import { EncryptedUserFields } from "../models/encrypted-user-fields";
import { selectEncryptedUserFields } from "../queries/select-encrypted-user-fields";
import { toUserPii } from "../mappers/to-user-pii";
import { toEncryptedUserPii } from "../mappers/to-encrypted-user-pii";
import { updateEncryptedUserFields } from "../queries/update-encrypted-user-fields";

export async function opReEncrypt(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  const t0 = Date.now();
  const responses = await Promise.all([
    _reEncryptAdminRecords(context),
    _reEncryptUserRecords(context),
    _reEncryptDogRecords(context),
    _reEncryptCallRecords(context),
    _reEncryptReportRecords(context),
  ]);
  for (const res of responses) {
    if (res.error !== undefined) {
      return Err(res.error);
    }
  }
  const tables = responses.map((res): ReEncryptTableInfo => res.result!);
  const t1 = Date.now();
  return Ok({
    tables,
    numMillis: t1 - t0,
  });
}

async function _reEncryptAdminRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  return Ok({
    table: "admin",
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptUserRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const records: EncryptedUserFields[] =
    await selectEncryptedUserFields(dbPool);
  const results: number[] = await Promise.all(
    records.map(async (record) => {
      const { userId, userEncryptedPii } = record;
      const userPii = await toUserPii(context, userEncryptedPii);
      const reEncryptedUserPii = await toEncryptedUserPii(context, userPii);
      const encryptedUserFields: EncryptedUserFields = {
        userId,
        userEncryptedPii: reEncryptedUserPii,
      };
      const { updated } = await updateEncryptedUserFields(dbPool, {
        encryptedUserFields,
      });
      return updated ? 1 : 0;
    }),
  );
  const numRecords = results.reduce((a, b) => {return a + b}, 0)
  return Ok({
    table: "users",
    numRecords,
    numValues: numRecords,
  });
}

async function _reEncryptDogRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  // WIP: oii and encrypted reason
  return Ok({
    table: "dogs",
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptCallRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  return Ok({
    table: "calls",
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptReportRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  return Ok({
    table: "reports",
    numRecords: 0,
    numValues: 0,
  });
}
