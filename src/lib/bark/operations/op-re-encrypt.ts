import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { z } from "zod";

const ReEncryptResultSchema = z.object({
  numRecords: z.number().min(0),
  numValues: z.number().min(0),
});

type ReEncryptResult = z.infer<typeof ReEncryptResultSchema>;

export async function opReEncrypt(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
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
    };
  });
  return Ok(result);
}

async function _reEncryptAdminRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({ numRecords: 0, numValues: 0 });
}

async function _reEncryptUserRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({ numRecords: 0, numValues: 0 });
}

async function _reEncryptDogRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  // WIP: oii and encrypted reason
  return Ok({ numRecords: 0, numValues: 0 });
}

async function _reEncryptCallRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({ numRecords: 0, numValues: 0 });
}

async function _reEncryptReportRecords(
  context: BarkContext,
): Promise<Result<ReEncryptResult, typeof CODE.FAILED>> {
  return Ok({ numRecords: 0, numValues: 0 });
}
