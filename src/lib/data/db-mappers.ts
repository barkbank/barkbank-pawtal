import { DogRecord, DogSpec, User, UserSpec } from "./db-models";

export function toUserSpec(user: User): UserSpec {
  const { userId, userCreationTime, userModificationTime, ...spec } = user;
  return spec;
}

export function toDogSpec(dog: DogRecord): DogSpec {
  const { userId, dogId, dogCreationTime, dogModificationTime, ...spec } = dog;
  return spec;
}
