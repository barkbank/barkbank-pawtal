import { CODE } from "../utilities/bark-code";
import { Result } from "../utilities/result";
import { BarkReport, BarkReportData } from "./bark-models";

export interface BarkService {
  /**
   * Create a report.
   *
   * @param appointmentId ID of the appointment for which the report has been written.
   * @param reportData Details of the report.
   */
  createReport(
    appointmentId: string,
    reportData: BarkReportData,
  ): Promise<
    Result<
      { reportId: string },
      typeof CODE.ERROR_APPOINTMENT_NOT_FOUND | typeof CODE.STORAGE_FAILURE
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
