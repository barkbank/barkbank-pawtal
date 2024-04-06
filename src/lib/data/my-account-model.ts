import { UserPii } from "./db-models";

export type MyAccount = {
  userId: string;
  userCreationTime: Date;
  userResidency: string;
  ownPii: UserPii;
};
