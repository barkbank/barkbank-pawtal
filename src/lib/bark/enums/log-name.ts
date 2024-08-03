import { z } from "zod";

export const LOG_NAME = {
  PAGE_LOAD_EVENT: "PageLoadEvent",
} as const;

export const LogNameSchema = z.nativeEnum(LOG_NAME);
export type LogName = z.infer<typeof LogNameSchema>;
