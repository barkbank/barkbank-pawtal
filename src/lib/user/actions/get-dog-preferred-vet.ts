import { Err, Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import {
  DogPreferredVet,
  DogPreferredVetSchema,
} from "@/lib/bark/models/dog-preferred-vet";
import { CODE } from "@/lib/utilities/bark-code";
import { dbResultQuery } from "@/lib/data/db-utils";
import { z } from "zod";

export async function getDogPreferredVet(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    DogPreferredVet | null,
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.ERROR_MORE_THAN_ONE_PREFERRED_VET
    | typeof CODE.DB_QUERY_FAILURE
  >
> {
  const { dbPool, userId } = actor.getParams();
  const sql = `
  SELECT
    tDog.user_id as "ownerUserId",
    tDog.dog_id as "dogId",
    COALESCE(tVet.vet_id::text, '') as "vetId",
    COALESCE(tVet.vet_email, '') as "vetEmail",
    COALESCE(tVet.vet_name, '') as "vetName",
    COALESCE(tVet.vet_phone_number, '') as "vetPhoneNumber",
    COALESCE(tVet.vet_address, '') as "vetAddress"
  FROM dogs as tDog
  LEFT JOIN dog_vet_preferences as tPref on tDog.dog_id = tPref.dog_id
  LEFT JOIN vets as tVet on tPref.vet_id = tVet.vet_id
  WHERE tDog.dog_id = $1
  `;

  // The query might return empty strings when there is no preferred vet. So
  // remove the vetEmail validation.
  const RowSchema = DogPreferredVetSchema.omit({ vetEmail: true }).extend({
    ownerUserId: z.string(),
    vetEmail: z.string(),
  });
  type Row = z.infer<typeof RowSchema>;
  const { result, error } = await dbResultQuery<Row>(dbPool, sql, [dogId]);
  if (error !== undefined) {
    return Err(error);
  }
  if (result.rows.length === 0) {
    return Err(CODE.ERROR_DOG_NOT_FOUND);
  }
  if (result.rows.length !== 1) {
    return Err(CODE.ERROR_MORE_THAN_ONE_PREFERRED_VET);
  }
  const { ownerUserId, ...otherFields } = RowSchema.parse(result.rows[0]);
  if (ownerUserId !== userId) {
    return Err(CODE.ERROR_WRONG_OWNER);
  }
  const dogPreferredVet: DogPreferredVet = otherFields;
  if (dogPreferredVet.vetId === "") {
    return Ok(null);
  }
  return Ok(DogPreferredVetSchema.parse(dogPreferredVet));
}
