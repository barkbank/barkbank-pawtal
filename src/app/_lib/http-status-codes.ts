/**
 * HTTP Status Codes
 *
 * When adding new codes, consult the following reference and include a short
 * description.
 *
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 *
 */
export const HttpStatus = {
  HTTP_200_OK: 200,

  /**
   * The request has been fulfilled, resulting in the creation of a new resource.
   */
  HTTP_201_CREATED: 201,

  /**
   * Similar to 403 Forbidden, but specifically for use when authentication is
   * required and has failed or has not yet been provided.
   */
  HTTP_401_UNAUTHORIZED: 401,

  /**
   * The request contained valid data and was understood by the server, but the
   * server is refusing action. This may be due to the user not having the
   * necessary permissions for a resource or needing an account of some sort, or
   * attempting a prohibited action (e.g. creating a duplicate record where only
   * one is allowed).
   */
  HTTP_403_FORBIDDEN: 403,

  /**
   * The requested resource could not be found but may be available in the
   * future.
   */
  HTTP_404_NOT_FOUND: 404,

  /**
   * A generic error message, given when an unexpected condition was encountered
   * and no more specific message is suitable.
   */
  HTTP_500_INTERNAL_SERVER_ERROR: 500,
} as const;
