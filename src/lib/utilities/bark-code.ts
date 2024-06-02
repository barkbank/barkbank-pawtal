/**
 * Standard error or response codes.
 */
export const CODE = {
  /**
   * Success
   */
  OK: "OK",

  /**
   * When an operation failed and there is no more detail than that.
   */
  FAILED: "FAILED",

  /**
   * When an expected account cannot be found. e.g. when sending OTP.
   */
  ERROR_ACCOUNT_NOT_FOUND: "ERROR_ACCOUNT_NOT_FOUND",

  /**
   * When an attempt is made to register an account that already exists.
   */
  ERROR_ACCOUNT_ALREADY_EXISTS: "ERROR_ACCOUNT_ALREADY_EXISTS",

  /**
   * When OTP is invalid.
   */
  ERROR_INVALID_OTP: "ERROR_INVALID_OTP",

  /**
   * When the caller is not logged-in at all or as the wrong correct account
   * type.
   */
  ERROR_NOT_LOGGED_IN: "ERROR_NOT_LOGGED_IN",

  /**
   * When an actor is not allowed to execute an operation.
   */
  ERROR_NOT_ALLOWED: "ERROR_NOT_ALLOWED",

  /**
   * When a specified user cannot be found.
   */
  ERROR_USER_NOT_FOUND: "ERROR_USER_NOT_FOUND",

  /**
   * When a specified dog cannot be found.
   */
  ERROR_DOG_NOT_FOUND: "ERROR_DOG_NOT_FOUND",

  /**
   * When a specified vet cannot be found.
   */
  ERROR_VET_NOT_FOUND: "ERROR_VET_NOT_FOUND",

  /**
   * When a user is not the owner of a specified dog.
   */
  ERROR_WRONG_OWNER: "ERROR_WRONG_OWNER",

  /**
   * When a vet is not a preferred vet of a specified dog.
   */
  ERROR_NOT_PREFERRED_VET: "ERROR_NOT_PREFERRED_VET",

  /**
   * When an attempt is made to update a full profile but it is not allowed.
   * Full profile updates are allowed only before the first medical report is
   * received.
   */
  ERROR_CANNOT_UPDATE_FULL_PROFILE: "ERROR_CANNOT_UPDATE_FULL_PROFILE",

  /**
   * When an attempt is made to update a sub profile, but caller should be
   * updating the full profile instead.
   */
  ERROR_SHOULD_UPDATE_FULL_PROFILE: "ERROR_SHOULD_UPDATE_FULL_PROFILE",

  /**
   * When we find there is more than one preferred vet.
   */
  ERROR_MORE_THAN_ONE_PREFERRED_VET: "ERROR_MORE_THAN_ONE_PREFERRED_VET",

  /**
   * When a requested report cannot be found.
   */
  ERROR_REPORT_NOT_FOUND: "ERROR_REPORT_NOT_FOUND",

  /**
   * When an appointment ID was provided that does not refer to an appointment
   * on record.
   */
  ERROR_APPOINTMENT_NOT_FOUND: "ERROR_APPOINTMENT_NOT_FOUND",

  /**
   * When an appointment already exists for some specified dog and vet.
   */
  ERROR_APPOINTMENT_ALREADY_EXISTS: "ERROR_APPOINTMENT_ALREADY_EXISTS",

  /**
   * When attempting to cancel or submit-report for an appointment that is not
   * in the PENDING state.
   */
  ERROR_APPOINTMENT_IS_NOT_PENDING: "ERROR_APPOINTMENT_IS_NOT_PENDING",

  /**
   * When a database query failed.
   */
  DB_QUERY_FAILURE: "DB_QUERY_FAILURE",
} as const;
