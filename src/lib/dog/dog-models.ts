/**
 * An appointment
 */
export type DogAppointment = {
  dogId: string;
  callId: string;
  vetId: string;
  vetName: string;
};

export type DogPreferredVet = {
  dogId: string;
  vetId: string;
  vetEmail: string;
  vetName: string;
  vetPhoneNumber: string;
  vetAddress: string;
};
