import { Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import {
  DogProfile,
  DogProfileSpec,
  SubProfileSpec,
} from "../models/dog-profile-models";
import { CODE } from "@/lib/utilities/bark-code";

export class DogProfileService {
  constructor(private config: { context: BarkContext }) {}

  async addDogProfile(args: {
    userId: string;
    spec: DogProfileSpec;
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

  async listDogProfiles(args: {
    userId: string;
  }): Promise<Result<DogProfile[], typeof CODE.FAILED>> {
    throw new Error("Not implemented");
  }

  async updateDogProfile(args: {
    userId: string;
    dogId: string;
    spec: DogProfileSpec;
  }): Promise<
    | typeof CODE.OK
    | typeof CODE.FAILED
    | typeof CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE
  > {
    throw new Error("Not implemented");
  }

  async updateSubProfile(args: {
    userId: string;
    dogId: string;
    spec: SubProfileSpec;
  }): Promise<
    | typeof CODE.OK
    | typeof CODE.FAILED
    | typeof CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE
  > {
    throw new Error("Not implemented");
  }
}
