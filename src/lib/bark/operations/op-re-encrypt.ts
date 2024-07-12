import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { ReEncryptResult } from "../models/re-encrypt-result";
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
  const results = responses.map((res): ReEncryptResult => res.result!);
  const result = _sumResults(results);
  const t1 = Date.now();
  return Ok({
    ...result,
    numMillis: t1 - t0,
  });
}

function _reduceResult(
  a: ReEncryptResult,
  b: ReEncryptResult,
): ReEncryptResult {
  return {
    numRecords: a.numRecords + b.numRecords,
    numValues: a.numValues + b.numValues,
  };
}

function _sumResults(results: ReEncryptResult[]): ReEncryptResult {
  return results.reduce(_reduceResult, {
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptAdminRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptUserRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const records: EncryptedUserFields[] =
    await selectEncryptedUserFields(dbPool);
  const results = await Promise.all(
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
      return updated
        ? {
            numRecords: 1,
            numValues: 1,
          }
        : {
            numRecords: 0,
            numValues: 0,
          };
    }),
  );
  return Ok(_sumResults(results));
}

async function _reEncryptDogRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  // WIP: oii and encrypted reason
  return Ok({
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptCallRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptReportRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({
    numRecords: 0,
    numValues: 0,
    numMillis: 0,
  });
}
