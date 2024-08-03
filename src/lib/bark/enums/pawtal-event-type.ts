import { z } from "zod";

export const PAWTAL_EVENT_TYPE = {
  PAGE_LOAD: "ui.pageload",
} as const;

export const PawtalEventTypeSchema = z.nativeEnum(PAWTAL_EVENT_TYPE);
export type PawtalEventType = z.infer<typeof PawtalEventTypeSchema>;
