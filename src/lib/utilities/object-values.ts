/**
 * Use this to define "enums".
 *
 * Usage
 *
 * (1) Given a const object like
 *
 * const MY_VALUE = {
 *   VAL1: "VAL1",
 *   VAL2: "VAL2",
 * } as const;
 *
 * (2) Create a type as follows
 *
 * type MyValue = ObjectValues<typeof MY_VALUE>;
 */
export type ObjectValues<T> = T[keyof T];
