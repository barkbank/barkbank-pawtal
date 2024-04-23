export type KnownDog = {
  dogName: string;
  dogStatus: string;
};

export type KnownUser = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  userResidency: string;
  userDogs: KnownDog[];
};

export function getKnownUser(): KnownUser {
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
