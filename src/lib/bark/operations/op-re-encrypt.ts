import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import {
  ReEncryptResult,
  ReEncryptTableInfo,
} from "../models/re-encrypt-result";
import { EncryptedUserFields } from "../models/encrypted-user-fields";
import { selectEncryptedUserFields } from "../queries/select-encrypted-user-fields";
import { toUserPii } from "../mappers/to-user-pii";
import { toEncryptedUserPii } from "../mappers/to-encrypted-user-pii";
import { updateEncryptedUserFields } from "../queries/update-encrypted-user-fields";
import { EncryptedAdminFields } from "../models/encrypted-admin-fields";
import { DbContext } from "@/lib/data/db-utils";

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

async function _reEncryptTable<T>(
  context: BarkContext,
  args: {
    tableName: string;
    reEncrypt: (src: T) => Promise<T>;
    fetchAll: (dbContext: DbContext) => Promise<T[]>;
    updateOne: (dbContext: DbContext, reEncrypted: T) => Promise<void>;
  },
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { tableName, reEncrypt, fetchAll, updateOne } = args;
  try {
    const records = await fetchAll(dbPool);
    await Promise.all(
      records.map(async (record) => {
        const reEncrypted = await reEncrypt(record);
        await updateOne(dbPool, reEncrypted);
      }),
    );
    return Ok({
      table: tableName,
      numRecords: records.length,
    });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}

async function _reEncryptAdminRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  const { dbPool } = context;

  const reEncrypt = async (
    src: EncryptedAdminFields,
  ): Promise<EncryptedAdminFields> => {
    const { adminId, adminEncryptedPii } = src;
    return src;
  };

  return Ok({
    table: "admin",
    numRecords: 0,
    numValues: 0,
  });
}

async function _reEncryptUserRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  const reEncrypt = async (
    src: EncryptedUserFields,
  ): Promise<EncryptedUserFields> => {
    const { userId, userEncryptedPii } = src;
    const userPii = await toUserPii(context, userEncryptedPii);
    const reEncryptedUserPii = await toEncryptedUserPii(context, userPii);
    const out: EncryptedUserFields = {
      userId,
      userEncryptedPii: reEncryptedUserPii,
    };
    return out;
  };

  const updateOne = (
    dbContext: DbContext,
    encryptedUserFields: EncryptedUserFields,
  ): Promise<void> => {
    return updateEncryptedUserFields(dbContext, { encryptedUserFields });
  };

  return _reEncryptTable(context, {
    tableName: "users",
    reEncrypt,
    fetchAll: selectEncryptedUserFields,
    updateOne,
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
