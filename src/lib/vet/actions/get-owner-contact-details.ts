import { Err, Result } from "@/lib/utilities/result";
import { VetActor } from "../vet-actor";
import { OwnerContactDetails } from "../vet-models";

type ErrorCode = "ERROR_UNAUTHORIZED";

/**
 * Get contact details of a dog's owner.
 *
 * @param actor Vet Actor
 * @param dogId Dog ID
 * @returns ERROR_UNAUTHORIZED when vet is not a preferred vet.
 * @returns owner contact details otherwise.
 */
export async function getOwnerContactDetails(
  actor: VetActor,
  dogId: string,
): Promise<Result<OwnerContactDetails, ErrorCode>> {
  return Err("ERROR_UNAUTHORIZED");
}
