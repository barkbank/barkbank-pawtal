import { VetActor } from "../vet-actor";
import { AvailableDog } from "../vet-models";

/**
 * Get dogs that are available for scheduling.
 *
 * A dog is available when:
 * - the actor is a preferred vet of the dog
 * - AND dog has no pending reports
 * - AND service_status is AVAILABLE
 * - AND profile_status is COMPLETE
 * - AND medical_status is ELIGIBLE
 * - AND participation_status is PARTICPATING
 *
 * @param actor
 * @returns list of available dogs
 */
export async function getAvailableDogs(
  actor: VetActor,
): Promise<AvailableDog[]> {
  return [];
}
