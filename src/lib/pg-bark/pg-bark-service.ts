import { Pool } from "pg";
import { BarkReport, BarkReportData } from "../bark/bark-models";
import { BarkService } from "../bark/bark-service";
import { CODE } from "../utilities/bark-code";
import { Result } from "../utilities/result";
import { addAppointment } from "./_impls/add-appointment";
import { createReport } from "./_impls/create-report";
import { DogMapper } from "../data/dog-mapper";
import { UserMapper } from "../data/user-mapper";
import { EncryptionService } from "../services/encryption";
import { hasAppointment } from "./_impls/has-appointment";

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
    // WIP: Implement getReport
    throw new Error("Method not implemented.");
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
    return addAppointment(this.config, args);
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
    return hasAppointment(this.config, args);
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
    return createReport(this.config, args);
  }
}
