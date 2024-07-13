import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedDogFields,
  EncryptedDogFieldsSchema,
} from "../models/encrypted-dog-fields";
import { z } from "zod";

export async function selectEncryptedDogFields(
  dbContext: DbContext,
): Promise<EncryptedDogFields[]> {
  const sql = `
  SELECT
    dog_id as "dogId",
    dog_encrypted_oii as "dogEncryptedOii"
  FROM dogs
  `;
  const res = await dbQuery<EncryptedDogFields>(dbContext, sql, []);
  return z.array(EncryptedDogFieldsSchema).parse(res.rows);
}
