import { BarkFormOption } from "@/components/bark/bark-form-option";
import { USER_TITLE } from "@/lib/bark/enums/user-title";

export const NA_TEXT = "N/A";

export const USER_TITLE_OPTIONS: BarkFormOption[] = [
  { label: "Mr", value: USER_TITLE.MR },
  { label: "Ms", value: USER_TITLE.MS },
  { label: "Mrs", value: USER_TITLE.MRS },
  { label: "Mdm", value: USER_TITLE.MDM },
  { label: "Prefer not to say", value: USER_TITLE.PREFER_NOT_TO_SAY },
];

/**
 * The minimum number of milliseconds to display a toast.
 */
export const MINIMUM_TOAST_MILLIS = 1337;
