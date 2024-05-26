import { Pool } from "pg";
import { BarkReport, BarkReportData } from "../bark/bark-models";
import { BarkService } from "../bark/bark-service";
import { CODE } from "../utilities/bark-code";
import { Result } from "../utilities/result";
import { BarkAction_createReport } from "../bark/actions/create-report";
import { DogMapper } from "../data/dog-mapper";
import { UserMapper } from "../data/user-mapper";
import { EncryptionService } from "../services/encryption";
import { BarkAction_hasAppointment } from "../bark/actions/has-appointment";
import { getReport } from "./_impls/get-report";
import { updateReport } from "./_impls/update-report";
import { BarkAction_addAppointment } from "../bark/actions/add-appointment";

export type PgBarkServiceConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  textEncryptionService: EncryptionService;
};

export class PgBarkService implements BarkService {
  constructor(private config: PgBarkServiceConfig) {}

  getReport(args: {
    reportId: string;
  }): Promise<
    Result<
      { report: BarkReport },
      typeof CODE.ERROR_REPORT_NOT_FOUND | typeof CODE.STORAGE_FAILURE
    >
  > {
    return getReport(this.config, args);
  }

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
  > {
    return BarkAction_addAppointment(this.config, args);
  }

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
  > {
    return BarkAction_hasAppointment(this.config, args);
  }

  createReport(args: {
    appointmentId: string;
    reportData: BarkReportData;
  }): Promise<
    Result<
      { reportId: string },
      typeof CODE.ERROR_APPOINTMENT_NOT_FOUND | typeof CODE.STORAGE_FAILURE
    >
  > {
    return BarkAction_createReport(this.config, args);
  }

  updateReport(args: {
    reportId: string;
    reportData: BarkReportData;
  }): Promise<
    | typeof CODE.OK
    | typeof CODE.ERROR_REPORT_NOT_FOUND
    | typeof CODE.STORAGE_FAILURE
  > {
    return updateReport(this.config, args);
  }
}
