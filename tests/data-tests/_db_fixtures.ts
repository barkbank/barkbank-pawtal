import { UserSpec } from "@/lib/data/db-models";

// TODO: Consolidate these fixtures in _db_fixtures.ts into _fixtures.ts

export function ensureTimePassed(): void {
  const t0 = new Date().getTime();
  let t1 = new Date().getTime();
  while (t0 === t1) {
    t1 = new Date().getTime();
  }
}
export function userSpec(idx: number): UserSpec {
  return {
    userHashedEmail: hashedEmail(idx),
    userEncryptedPii: encryptedPii(idx),
  };
}
function encryptedPii(idx: number): string {
  return `encryptedPii(${idx})`;
}
function hashedEmail(idx: number): string {
  return `hashed(${email(idx)})`;
}
function email(idx: number): string {
  return `user${idx}@system.com`;
}
