import { BarkReportData, BarkReport } from "../bark/bark-models";
import { BarkService } from "../bark/bark-service";
import { CODE } from "../utilities/bark-code";
import { Result } from "../utilities/result";

export class PgBarkService implements BarkService {
  async createReport(
    callId: string,
    reportData: BarkReportData,
  ): Promise<
    Result<
      BarkReport,
      typeof CODE.ERROR_CALL_NOT_FOUND | typeof CODE.STORAGE_FAILURE
    >
  > {
    throw new Error("Not implemented");
  }
}
