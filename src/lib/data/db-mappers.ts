import { User, UserSpec } from "./db-models";

export function toUserSpec(user: User): UserSpec {
  const { userId, userCreationTime, userModificationTime, ...spec } = user;
  return spec;
}
