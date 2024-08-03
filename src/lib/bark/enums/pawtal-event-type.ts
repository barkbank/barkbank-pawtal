import { z } from "zod";

export const PAWTAL_EVENT_TYPE = {
  APP_CREATED: "app.created",
  PAGE_LOAD: "ui.pageload",
} as const;

export const PawtalEventTypeSchema = z.nativeEnum(PAWTAL_EVENT_TYPE);
export type PawtalEventType = z.infer<typeof PawtalEventTypeSchema>;
