import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import {
  ReEncryptResult,
  ReEncryptTableInfo,
} from "../models/re-encrypt-result";
import { selectEncryptedUserFields } from "../queries/select-encrypted-user-fields";
import { updateEncryptedUserFields } from "../queries/update-encrypted-user-fields";
import { DbContext } from "@/lib/data/db-utils";
import { toReEncryptedUserFields } from "../mappers/to-re-encrypted-user-fields";
import { toReEncryptedAdminFields } from "../mappers/to-re-encrypted-admin-fields";
import { selectEncryptedAdminFields } from "../queries/select-encrypted-admin-fields";
import { updateEncryptedAdminFields } from "../queries/update-encrypted-admin-fields";
import { toDogName } from "../mappers/to-dog-name";
import { toDogOii } from "../mappers/to-dog-oii";
import { toDogEncryptedOii } from "../mappers/to-dog-encrypted-oii";
import { EncryptedDogFields } from "../models/encrypted-dog-fields";
import { toReEncryptedDogFields } from "../mappers/to-re-encrypted-dog-fields";
import { selectEncryptedDogFields } from "../queries/select-encrypted-dog-fields";
import { updateEncryptedDogFields } from "../queries/update-encrypted-dog-fields";

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
    reEncrypt: (context: BarkContext, src: T) => Promise<T>;
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
        const reEncrypted = await reEncrypt(context, record);
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
  return _reEncryptTable(context, {
    tableName: "admins",
    reEncrypt: toReEncryptedAdminFields,
    fetchAll: selectEncryptedAdminFields,
    updateOne: (ctx, encryptedAdminFields) => {
      return updateEncryptedAdminFields(ctx, { encryptedAdminFields });
    },
  });
}

async function _reEncryptUserRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  return _reEncryptTable(context, {
    tableName: "users",
    reEncrypt: toReEncryptedUserFields,
    fetchAll: selectEncryptedUserFields,
    updateOne: (ctx, encryptedUserFields) => {
      return updateEncryptedUserFields(ctx, { encryptedUserFields });
    },
  });
}

async function _reEncryptDogRecords(
  context: BarkContext,
): Promise<Result<ReEncryptTableInfo, typeof CODE.FAILED>> {
  return _reEncryptTable(context, {
    tableName: "dogs",
    reEncrypt: toReEncryptedDogFields,
    fetchAll: selectEncryptedDogFields,
    updateOne: (ctx, encryptedDogFields) => {
      return updateEncryptedDogFields(ctx, { encryptedDogFields });
    },
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
