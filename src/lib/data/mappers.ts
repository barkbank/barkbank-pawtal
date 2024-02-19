import {
  Dog,
  DogSpec,
  User,
  UserSpec,
  Staff,
  StaffSpec,
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

export function toStaffSpec(staff: Staff): StaffSpec {
  const { staffId, staffCreationTime, ...spec } = staff;
  return spec;
}

export function toVetSpec(vet: Vet): VetSpec {
  const { vetId, vetCreationTime, ...spec } = vet;
  return spec;
}
