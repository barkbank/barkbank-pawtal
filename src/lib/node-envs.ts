import { ObjectValues } from "./utilities/object-values";

export const NODE_ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type NodeEnv = ObjectValues<typeof NODE_ENV>;
