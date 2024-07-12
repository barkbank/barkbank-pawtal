import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { ReEncryptResult } from "../models/re-encrypt-result";

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
  const result: ReEncryptResult = results.reduce((a, b) => {
    return {
      numRecords: a.numRecords + b.numRecords,
      numValues: a.numValues + b.numValues,
      numConcurrentMillis: a.numConcurrentMillis + b.numConcurrentMillis,
      numActualMillis: 0,
    };
  });
  const t1 = Date.now();
  const { numActualMillis, ...otherValues } = result;
  return Ok({ numActualMillis: t1 - t0, ...otherValues });
}

async function _reEncryptAdminRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({
    numRecords: 0,
    numValues: 0,
    numConcurrentMillis: 0,
    numActualMillis: 0,
  });
}

async function _reEncryptUserRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({
    numRecords: 0,
    numValues: 0,
    numConcurrentMillis: 0,
    numActualMillis: 0,
  });
}

async function _reEncryptDogRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  // WIP: oii and encrypted reason
  return Ok({
    numRecords: 0,
    numValues: 0,
    numConcurrentMillis: 0,
    numActualMillis: 0,
  });
}

async function _reEncryptCallRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({
    numRecords: 0,
    numValues: 0,
    numConcurrentMillis: 0,
    numActualMillis: 0,
  });
}

async function _reEncryptReportRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({
    numRecords: 0,
    numValues: 0,
    numConcurrentMillis: 0,
    numActualMillis: 0,
  });
}
