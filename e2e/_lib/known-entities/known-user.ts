import { PomUser } from "../pom/entities";

// WIP: define _lib/known-entities/known-vet.ts
// WIP: define _lib/known-entities/known-admin.ts
/**
 * @returns Details of the known user that make local-accounts creates.
 */
export function getKnownUser(): PomUser {
  return {
    userName: "Tess Yu Ser",
    userEmail: "test_user@user.com",
    userPhoneNumber: "+65 30002000",
    userResidency: "Singapore",
    userDogs: [
      {
        dogName: "Mape",
        dogStatus: "Eligible",
      },
      {
        dogName: "Ridley",
        dogStatus: "Temporarily Ineligible",
      },
      {
        dogName: "Perry",
        dogStatus: "Ineligible",
      },
      {
        dogName: "Bentley",
        dogStatus: "Profile Incomplete",
      },
    ],
  };
}
