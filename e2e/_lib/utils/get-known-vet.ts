import { KnownVet, KnownVetSchema } from "../models/known-vet";

export function getKnownVet(): KnownVet {
  const res: KnownVet = {
    vetEmail: "vet1@vet.com",
    vetName: "Vet Clinic 1",
    vetPhoneNumber: "+6560000001",
    vetAddress: "1 Dog Park Drive",
  };
  return KnownVetSchema.parse(res);
}
