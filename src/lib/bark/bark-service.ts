import { CODE } from "../utilities/bark-code";
import { Err, Result } from "../utilities/result";
import { BarkReport, BarkReportData } from "./bark-models";

export class BarkService {
  async createReport(
    callId: string,
    reportData: BarkReportData,
  ): Promise<Result<BarkReport, typeof CODE.FAILED>> {
    return Err(CODE.FAILED);
  }
  // getReport(
  //   reportId: string,
  // ): Promise<Result<BarkReport, typeof CODE.ERROR_REPORT_NOT_FOUND>>;
  // updateReport(
  //   reportId: string,
  //   reportData: BarkReportData,
  // ): Promise<Result<BarkReport, typeof CODE.FAILED>>;
}
