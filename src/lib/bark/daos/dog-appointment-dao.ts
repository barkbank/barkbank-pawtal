import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  DogAppointment,
  DogAppointmentSchema,
} from "../models/dog-appointment";
import { z } from "zod";

export class DogAppointmentDao {
  constructor(private db: DbContext) {}

  async getDogAppointmentsByDogId(args: { dogId: string }) {
    const { dogId } = args;
    const sql = `
    SELECT
      tCall.dog_id as "dogId",
      tCall.call_id as "appointmentId",
      tCall.vet_id as "vetId",
      tVet.vet_name as "vetName",
      tVet.vet_phone_number as "vetPhoneNumber",
      tVet.vet_address as "vetAddress"
    FROM calls as tCall
    LEFT JOIN vets as tVet on tCall.vet_id = tVet.vet_id
    WHERE tCall.dog_id = $1
    AND tCall.call_outcome = 'APPOINTMENT'
    ORDER BY tCall.call_creation_time DESC
    `;
    const res = await dbQuery<DogAppointment>(this.db, sql, [dogId]);
    return z.array(DogAppointmentSchema).parse(res.rows);
  }
}
