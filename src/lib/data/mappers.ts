import {
  Dog,
  DogSpec,
  User,
  UserSpec,
  Admin,
  AdminSpec,
  Vet,
  VetSpec,
} from "./models";

export function toUserSpec(user: User): UserSpec {
  const { userId, userCreationTime, ...spec } = user;
  return spec;
}

export function toDogSpec(dog: Dog): DogSpec {
  const { userId, dogId, dogCreationTime, ...spec } = dog;
  return spec;
}

export function toAdminSpec(admin: Admin): AdminSpec {
  const { adminId, adminCreationTime, ...spec } = admin;
  return spec;
}

export function toVetSpec(vet: Vet): VetSpec {
  const { vetId, vetCreationTime, ...spec } = vet;
  return spec;
}
