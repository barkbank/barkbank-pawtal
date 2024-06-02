import { BarkReportData } from "./bark-report-data";


export type BarkReport = BarkReportData & {
  reportId: string;
  reportCreationTime: Date;
  reportModificationTime: Date;
  appointmentId: string;
  dogId: string;
  vetId: string;
};
