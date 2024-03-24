import { DogStatus } from "../bark-models";

export type MyDog = {
  dogId: string;
  dogName: string;
  dogStatus: DogStatus;
};

export type ListMyPetsResponse = {
  dogs: MyDog[];
};
