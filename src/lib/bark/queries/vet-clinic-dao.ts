import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  VetClinic,
  VetClinicSchema,
  VetClinicSpec,
} from "../models/vet-models";
import { z } from "zod";
import { QueryResult } from "pg";

export class VetClinicDao {
  private selectFromVets = `
  SELECT
    vet_id as "vetId",
    vet_name as "vetName",
    vet_email as "vetEmail",
    vet_phone_number as "vetPhoneNumber",
    vet_address as "vetAddress"
  FROM vets
  `;

  constructor(private db: DbContext) {}

  async getList(): Promise<VetClinic[]> {
    const sql = this.getSql("ORDER BY vet_name ASC");
    const res = await dbQuery<VetClinic>(this.db, sql, []);
    return this.toList(res);
  }

  async getByEmail(args: { email: string }): Promise<VetClinic | null> {
    const { email } = args;
    const sql = this.getSql("WHERE LOWER(vet_email) = LOWER($1)");
    const res = await dbQuery<VetClinic>(this.db, sql, [email]);
    return this.toRecordOrNull(res);
  }

  async getByVetId(args: { vetId: string }): Promise<VetClinic | null> {
    const { vetId } = args;
    const sql = this.getSql("WHERE vet_id = $1");
    const res = await dbQuery<VetClinic>(this.db, sql, [vetId]);
    return this.toRecordOrNull(res);
  }

  async insert(args: { spec: VetClinicSpec }): Promise<VetClinic> {
    const { vetEmail, vetName, vetPhoneNumber, vetAddress } = args.spec;
    const sql = `
    INSERT INTO vets (
      vet_email,
      vet_name,
      vet_phone_number,
      vet_address
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      vet_id as "vetId",
      vet_name as "vetName",
      vet_email as "vetEmail",
      vet_phone_number as "vetPhoneNumber",
      vet_address as "vetAddress"
    `;
    const res = await dbQuery<VetClinic>(this.db, sql, [
      vetEmail,
      vetName,
      vetPhoneNumber,
      vetAddress,
    ]);
    return this.toRecord(res);
  }

  private toList(res: QueryResult<VetClinic>): VetClinic[] {
    return z.array(VetClinicSchema).parse(res.rows);
  }

  private toRecordOrNull(res: QueryResult<VetClinic>): VetClinic | null {
    if (res.rows.length !== 1) {
      return null;
    }
    return VetClinicSchema.parse(res.rows[0]);
  }

  private toRecord(res: QueryResult<VetClinic>): VetClinic {
    return VetClinicSchema.parse(res.rows[0]);
  }

  private getSql(clauses: string): string {
    return `${this.selectFromVets} ${clauses}`;
  }
}
