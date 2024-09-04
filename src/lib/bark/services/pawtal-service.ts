import { Err, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { MyDog } from "../models/user-models";
import { CODE } from "@/lib/utilities/bark-code";
import { DogProfile } from "../models/dog-profile";

export class PawtalService {
  constructor(private config: { context: BarkContext }) {}

  async getMyDogs(args: {
    userId: string;
  }): Promise<Result<{ myDogs: MyDog[] }, typeof CODE.FAILED>> {
    throw new Error("TODO: Implement getMyDogs - Replaces getMyPets");
  }

  // TODO: When this is implemented, we should be able to remove getDogProfile
  async getDogProfile(args: {
    dogId: string;
  }): Promise<Result<{ dogProfile: DogProfile }, typeof CODE.FAILED>> {
    throw new Error("WIP: Implement getDogProfile - Replaces getDogProfile");
  }
}
