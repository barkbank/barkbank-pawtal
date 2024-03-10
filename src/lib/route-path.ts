export class RoutePath {
  static readonly ROOT = "/";
  static readonly LOGOUT_PAGE = "/api/auth/signout";

  static readonly USER_LOGIN_PAGE = "/user/login";
  static readonly USER_DASHBOARD_PAGE = "/user/dashboard";
  static readonly USER_MY_ACCOUNT_PAGE = "/user/my-account";
  static readonly USER_VIEW_DOG = (dogId: string) => `/user/dogs/${dogId}`;
  static readonly USER_EDIT_DOG = (dogId: string) => `/user/dogs/${dogId}/edit`;

  static readonly VET_LOGIN_PAGE = "/vet/login";
  static readonly VET_DASHBOARD_PAGE = "/vet/dashboard";

  static readonly ADMIN_LOGIN_PAGE = "/admin/login";
  static readonly ADMIN_DASHBOARD_PAGE = "/admin/dashboard";
  static readonly ADMIN_DATABASE_PAGE = "/admin/database";
  static readonly ADMIN_USER_ACCESS_PAGE = "/admin/user-access";

  static readonly CONTACT_US = "/contact-us";
  static readonly PRIVACY_POLICY = "/privacy-policy";
  static readonly TERMS_AND_CONDITIONS = "/terms-and-conditions";
}
