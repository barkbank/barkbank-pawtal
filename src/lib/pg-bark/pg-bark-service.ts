import { Pool } from "pg";
import { BarkReportData } from "../bark/bark-models";
import { BarkService } from "../bark/bark-service";
import { CODE } from "../utilities/bark-code";
import { Err, Result } from "../utilities/result";

export type PgBarkServiceConfig = {
  dbPool: Pool;
};

export class PgBarkService implements BarkService {
  constructor(private config: PgBarkServiceConfig) {}

  async createReport(
    callId: string,
    reportData: BarkReportData,
  ): Promise<
    Result<
      { reportId: string },
      typeof CODE.ERROR_CALL_NOT_FOUND | typeof CODE.STORAGE_FAILURE
    >
  > {
    return Err(CODE.ERROR_CALL_NOT_FOUND);
  }
}
