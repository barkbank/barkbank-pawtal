import { Pool } from "pg";
import { BarkReportData } from "../bark/bark-models";
import { BarkService } from "../bark/bark-service";
import { CODE } from "../utilities/bark-code";
import { Result } from "../utilities/result";
import { addAppointment } from "./_impls/add-appointment";
import { createReport } from "./_impls/create-report";
import { DogMapper } from "../data/dog-mapper";
import { UserMapper } from "../data/user-mapper";
import { EncryptionService } from "../services/encryption";

export type PgBarkServiceConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  textEncryptionService: EncryptionService;
};

export class PgBarkService implements BarkService {
  constructor(private config: PgBarkServiceConfig) {}

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
