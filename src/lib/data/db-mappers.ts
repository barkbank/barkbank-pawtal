import {
  Dog,
  DogSpec,
  User,
  UserSpec,
  AdminRecord,
  AdminSpec,
  Vet,
  VetSpec,
} from "./db-models";

export function toUserSpec(user: User): UserSpec {
  const { userId, userCreationTime, userModificationTime, ...spec } = user;
  return spec;
}

export function toDogSpec(dog: Dog): DogSpec {
  const { userId, dogId, dogCreationTime, dogModificationTime, ...spec } = dog;
  return spec;
}

export function toAdminSpec(admin: AdminRecord): AdminSpec {
  const { adminId, adminCreationTime, adminModificationTime, ...spec } = admin;
  return spec;
}

export function toVetSpec(vet: Vet): VetSpec {
  const { vetId, vetCreationTime, vetModificationTime, ...spec } = vet;
  return spec;
}
