/**
 * Standard codes for actor actions and server actions.
 */
export const BARK_CODE = {
  /**
   * Success
   */
  OK: "OK",

  /**
   * When the caller is not logged-in at all or as the wrong correct account
   * type.
   */
  ERROR_NOT_LOGGED_IN: "ERROR_NOT_LOGGED_IN",

  /**
   * When the operation needs to retrieve a specified user, but there is no such
   * user on record.
   */
  ERROR_USER_NOT_FOUND: "ERROR_USER_NOT_FOUND",

  /**
   * When the operation is for a specified dog (typically by dogId), but there
   * is no such dog.
   */
  ERROR_DOG_NOT_FOUND: "ERROR_DOG_NOT_FOUND",

  /**
   * When a user actor attempts to retrieve or mutate a dog related record, but
   * the user is not the owner of the dog.
   */
  ERROR_WRONG_OWNER: "ERROR_WRONG_OWNER",

  /**
   * When a database query failed.
   */
  FAILURE_DB_QUERY: "FAILURE_DB_QUERY",

  /**
   * When an operation failed for server related reasons. Conceptually, this
   * maps to a 500 server error.
   */
  FAILED: "FAILED",
} as const;
