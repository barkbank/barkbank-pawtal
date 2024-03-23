import { DogStatus } from "../bark-models";

export type DogListItem = {
  dogId: string;
  dogName: string;
  dogStatus: DogStatus;
};

export type DogList = {
  dogs: DogListItem[];
};
