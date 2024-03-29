import { DogStatus } from "../data/db-enums";

export type MyDog = {
  dogId: string;
  dogName: string;
  dogStatus: DogStatus;
};

export type ListMyPetsResponse = {
  dogs: MyDog[];
};
