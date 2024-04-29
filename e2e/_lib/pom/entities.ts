export type PomDog = {
  dogName: string;
  dogStatus: string;
};

export type PomUser = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  userResidency: string;
  userDogs: PomDog[];
};

// WIP: expand this stub for vets
// Stub for future extension
export type PomVet = {};

// WIP: expand this stub for admins
// Stub for future extension
export type PomAdmin = {};
