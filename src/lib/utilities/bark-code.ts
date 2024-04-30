/**
 * Standard codes for actor actions and server actions.
 */
export const CODE = {
  /**
   * Success
   */
  OK: "OK",

  /**
   * When an operation failed and there is no more detail than that.
   */
  // WIP: some of these are exceptions.
  FAILED: "FAILED",

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
   * When a database query failed.
   */
  DB_QUERY_FAILURE: "DB_QUERY_FAILURE",

  /**
   * An exception happned.
   */
  EXCEPTION: "EXCEPTION",
} as const;
