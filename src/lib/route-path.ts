import { AccountType } from "./auth-models";

export class RoutePath {
  static readonly ROOT = "/";
  static readonly LOGOUT_PAGE = "/logout";

  static readonly USER_REGISTRATION = "/user/registration";
  static readonly USER_LOGIN_PAGE = "/user/login";
  static readonly USER_MY_PETS = "/user/my-pets";
  static readonly USER_ADD_DOG = "/user/my-pets/add-dog";
  static readonly USER_MY_ACCOUNT_EDIT = "/user/my-account/edit";
  static readonly USER_MY_ACCOUNT_PAGE = "/user/my-account";
  static readonly USER_VIEW_DOG = (dogId: string) => `/user/dogs/${dogId}`;
  static readonly USER_EDIT_DOG = (dogId: string) => `/user/dogs/${dogId}/edit`;
  static readonly USER_CRITERIA = "/user/criteria";
  static readonly USER_PROCESS = "/user/process";
  static readonly USER_INFO = "/user/info";

  static readonly USER_DEFAULT_LOGGED_IN_PAGE = RoutePath.USER_MY_PETS;

  static readonly VET_LOGIN_PAGE = "/vet/login";
  static readonly VET_DASHBOARD_PAGE = "/vet/dashboard";
  static readonly VET_DEFAULT_LOGGED_IN_PAGE = RoutePath.VET_DASHBOARD_PAGE;

  static readonly ADMIN_LOGIN_PAGE = "/admin/login";
  static readonly ADMIN_DASHBOARD_PAGE = "/admin/dashboard";
  static readonly ADMIN_DATABASE_PAGE = "/admin/database";
  static readonly ADMIN_USER_ACCESS_PAGE = "/admin/user-access";
  static readonly ADMIN_DEFAULT_LOGGED_IN_PAGE = RoutePath.ADMIN_DASHBOARD_PAGE;

  static readonly CONTACT_US = "/contact-us";
  static readonly PRIVACY_POLICY = "/privacy-policy";
  static readonly TERMS_AND_CONDITIONS = "/terms-and-conditions";

  static readonly ARTICLES = "/articles";
  static readonly ABOUT_US = "/about";
  static readonly BE_A_DONOR = "/be-a-donor";
  static readonly INFO = "/info";

  static readonly WEBSITE_FAQ_URL = "https://www.barkbank.co/faq";
  static readonly WEBSITE_URL = "https://www.barkbank.co/";
}
