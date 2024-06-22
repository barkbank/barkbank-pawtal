export type PomDog = {
  dogName: string;
  dogStatus: string;
  vetName?: string;
};

// TODO: Is this still used?
export type PomUser = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  userResidency: string;
  userDogs: PomDog[];
};

export type PomVet = {
  vetEmail: string;
  vetName: string;
  vetPhoneNumber: string;
  vetAddress: string;
};

export type PomAdmin = {
  adminName: string;
  adminEmail: string;
  adminPhoneNumber: string;
};
