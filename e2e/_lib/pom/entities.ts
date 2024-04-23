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

// Stub for future extension
export type PomVet = {};

// Stub for future extension
export type PomAdmin = {};
