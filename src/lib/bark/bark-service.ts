import { CODE } from "../utilities/bark-code";
import { Result } from "../utilities/result";
import { BarkReport, BarkReportData } from "./bark-models";

export interface BarkService {
  /**
   * Create a report.
   *
   * @param callId ID of the call for which the report has been written.
   * @param reportData Details of the report.
   */
  createReport(
    callId: string,
    reportData: BarkReportData,
  ): Promise<
    Result<
      { reportId: string },
      typeof CODE.ERROR_CALL_NOT_FOUND | typeof CODE.STORAGE_FAILURE
    >
  >;
  // getReport(
  //   reportId: string,
  // ): Promise<Result<BarkReport, typeof CODE.ERROR_REPORT_NOT_FOUND>>;
  // updateReport(
  //   reportId: string,
  //   reportData: BarkReportData,
  // ): Promise<Result<BarkReport, typeof CODE.FAILED>>;
}
