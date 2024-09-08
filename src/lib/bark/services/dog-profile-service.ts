import { Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { DogProfile, SubProfile } from "../models/dog-profile-models";
import { CODE } from "@/lib/utilities/bark-code";

export class DogProfileService {
  constructor(private config: { context: BarkContext }) {}

  async addDogProfile(args: {
    userId: string;
    dogProfile: DogProfile;
  }): Promise<Result<{ dogId: string }, typeof CODE.FAILED>> {
    throw new Error("Not implemented");
  }

  async getDogProfile(args: {
    userId: string;
    dogId: string;
  }): Promise<
    Result<DogProfile, typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND>
  > {
    throw new Error("Not implemented");
  }

  async listDogProfile(args: {
    userId: string;
  }): Promise<Result<DogProfile[], typeof CODE.FAILED>> {
    throw new Error("Not implemented");
  }

  async updateDogProfile(args: {
    userId: string;
    dogId: string;
    dogProfile: DogProfile;
  }): Promise<typeof CODE.OK | typeof CODE.FAILED> {
    throw new Error("Not implemented");
  }

  async updateSubProfile(args: {
    userId: string;
    dogId: string;
    subProfile: SubProfile;
  }): Promise<typeof CODE.OK | typeof CODE.FAILED> {
    throw new Error("Not implemented");
  }
}
