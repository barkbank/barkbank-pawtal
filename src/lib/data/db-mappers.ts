import { UserRecord, UserSpec } from "./db-models";

export function toUserSpec(user: UserRecord): UserSpec {
  const { userId, userCreationTime, userModificationTime, ...spec } = user;
  return spec;
}
