import { ObjectValues } from "@/lib/utilities/object-values";
import { dbLoadSql } from "../../data/db-load-sql";

export const SQL_QUERY = {
  INSERT_APPOINTMENT: "insert-appointment",
  INSERT_REPORT_UPDATE_CALL: "insert-report-update-call",
  SELECT_APPOINTMENT_EXISTS: "select-appointment-exists",
  SELECT_CAN_SCHEDULE: "select-can-schedule",
  SELECT_REPORT: "select-report",
  UPDATE_REPORT: "update-report",
} as const;

export type SqlQueryName = ObjectValues<typeof SQL_QUERY>;

// WIP: remove the load-sql file
export function loadSql(queryName: SqlQueryName): string {
  return dbLoadSql(`src/lib/pg-bark/_sql/${queryName}.sql`);
}
