import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { VetClinic, VetClinicSchema } from "../models/vet-models";
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
    return this.toVetClinicList(res);
  }

  async getByEmail(args: { email: string }): Promise<VetClinic | null> {
    const { email } = args;
    const sql = this.getSql("WHERE LOWER(vet_email) = LOWER($1)");
    const res = await dbQuery<VetClinic>(this.db, sql, [email]);
    return this.toVetClinic(res);
  }

  async getByVetId(args: { vetId: string }): Promise<VetClinic | null> {
    const { vetId } = args;
    const sql = this.getSql("WHERE vet_id = $1");
    const res = await dbQuery<VetClinic>(this.db, sql, [vetId]);
    return this.toVetClinic(res);
  }

  private toVetClinicList(res: QueryResult<VetClinic>): VetClinic[] {
    return z.array(VetClinicSchema).parse(res.rows);
  }

  private toVetClinic(res: QueryResult<VetClinic>): VetClinic | null {
    if (res.rows.length !== 1) {
      return null;
    }
    return VetClinicSchema.parse(res.rows[0]);
  }

  private getSql(clauses: string): string {
    return `${this.selectFromVets} ${clauses}`;
  }
}
