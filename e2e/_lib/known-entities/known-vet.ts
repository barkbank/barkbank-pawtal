import { PomVet } from "../pom/entities";

export function getKnownVet(): PomVet {
  return {
    vetEmail: "vet1@vet.com",
    vetName: "Vet Clinic 1",
    vetPhoneNumber: "+6560000001",
    vetAddress: "1 Dog Park Drive",
  };
}
