import { CODE } from "../utilities/bark-code";
import { Result } from "../utilities/result";
import { BarkReport, BarkReportData } from "./bark-models";

export interface BarkService {
  addAppointment(args: {
    dogId: string;
    vetId: string;
  }): Promise<
    Result<
      { appointmentId: string },
      | typeof CODE.ERROR_DOG_NOT_FOUND
      | typeof CODE.ERROR_VET_NOT_FOUND
      | typeof CODE.ERROR_NOT_PREFERRED_VET
      | typeof CODE.ERROR_APPOINTMENT_ALREADY_EXISTS
      | typeof CODE.STORAGE_FAILURE
    >
  >;

  hasAppointment(args: {
    dogId: string;
    vetId: string;
  }): Promise<
    Result<
      { hasAppointment: boolean },
      | typeof CODE.ERROR_DOG_NOT_FOUND
      | typeof CODE.ERROR_VET_NOT_FOUND
      | typeof CODE.ERROR_NOT_PREFERRED_VET
      | typeof CODE.STORAGE_FAILURE
    >
  >;

  createReport(args: {
    appointmentId: string;
    reportData: BarkReportData;
  }): Promise<
    Result<
      { reportId: string },
      typeof CODE.ERROR_APPOINTMENT_NOT_FOUND | typeof CODE.STORAGE_FAILURE
    >
  >;

  getReport(args: {
    reportId: string;
  }): Promise<
    Result<
      { report: BarkReport },
      typeof CODE.ERROR_REPORT_NOT_FOUND | typeof CODE.STORAGE_FAILURE
    >
  >;

  // updateReport(
  //   reportId: string,
  //   reportData: BarkReportData,
  // ): Promise<Result<BarkReport, typeof CODE.FAILED>>;
}
