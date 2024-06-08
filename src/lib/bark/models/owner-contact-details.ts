export type OwnerContactDetails = {
  dogId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;

  /**
   * The last time the vet contacted the user.
   */
  vetUserLastContactedTime: Date | null;
};
