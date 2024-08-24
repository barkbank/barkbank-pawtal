export class RoutePath {
  static readonly ROOT = "/";
  static readonly LOGOUT_PAGE = "/logout";

  // User Routes /user
  static readonly USER_REGISTRATION = "/user/registration";
  static readonly USER_REGISTRATION_UTM_NEW_USER =
    "/user/registration?utm_source=pawtal&utm_medium=ul_new";
  static readonly USER_REGISTRATION_UTM_ACCOUNT_NOT_FOUND =
    "/user/registration?utm_source=pawtal&utm_medium=ul_not_found";
  static readonly USER_LOGIN_PAGE = "/user/login";
  static readonly USER_MY_PETS = "/user/my-pets";
  static readonly USER_ADD_DOG = "/user/my-pets/add-dog";
  static readonly USER_MY_ACCOUNT_EDIT = "/user/my-account/edit";
  static readonly USER_MY_ACCOUNT_PAGE = "/user/my-account";
  static readonly USER_VIEW_DOG = (dogId: string) =>
    `/user/my-pets/view-dog/${dogId}`;
  static readonly USER_EDIT_DOG = (dogId: string) =>
    `/user/my-pets/edit-dog/${dogId}`;
  static readonly USER_VIEW_REPORT = (reportId: string) =>
    `/user/my-pets/view-report/${reportId}`;
  static readonly USER_VIEW_DOG_REGEX =
    /.*[/]user[/]my-pets[/]view-dog[/][0-9]+/;
  static readonly USER_EDIT_DOG_REGEX =
    /.*[/]user[/]my-pets[/]edit-dog[/][0-9]+/;
  static readonly USER_VIEW_REPORT_REGEX =
    /.*[/]user[/]my-pets[/]view-report[/][0-9]+/;
  static readonly USER_CRITERIA = "/user/criteria";
  static readonly USER_PROCESS = "/user/process";
  static readonly USER_INFO = "/user/info";

  static readonly USER_DEFAULT_LOGGED_IN_PAGE = RoutePath.USER_MY_PETS;

  // Vet Routes /vet
  static readonly VET_LOGIN_PAGE = "/vet/login";
  static readonly VET_SCHEDULE_APPOINTMENTS = "/vet/schedule";
  static readonly VET_APPOINTMENTS_LIST = "/vet/appointments/list";
  static readonly VET_APPOINTMENTS_LIST_CANCELLED =
    "/vet/appointments/list-cancelled";
  static readonly VET_APPOINTMENTS_SUBMIT = (appointmentId: string) =>
    `/vet/appointments/submit/${appointmentId}`;
  static readonly VET_APPOINTMENTS_CANCEL = (appointmentId: string) =>
    `/vet/appointments/cancel/${appointmentId}`;
  static readonly VET_APPOINTMENTS_SUBMIT_REGEX =
    /.*[/]vet[/]appointments[/]submit[/][0-9]+/;
  static readonly VET_APPOINTMENTS_CANCEL_REGEX =
    /.*[/]vet[/]appointments[/]cancel[/][0-9]+/;
  static readonly VET_APPOINTMENTS = "/vet/appointments";
  static readonly VET_REPORTS = "/vet/reports";
  static readonly VET_REPORTS_LIST = "/vet/reports/list";
  static readonly VET_REPORTS_VIEW = (reportId: string) =>
    `/vet/reports/view/${reportId}`;
  static readonly VET_REPORTS_EDIT = (reportId: string) =>
    `/vet/reports/edit/${reportId}`;
  static readonly VET_REPORTS_VIEW_REGEX = /.*[/]vet[/]reports[/]view[/][0-9]+/;
  static readonly VET_REPORTS_EDIT_REGEX = /.*[/]vet[/]reports[/]edit[/][0-9]+/;
  static readonly VET_DEFAULT_LOGGED_IN_PAGE =
    RoutePath.VET_SCHEDULE_APPOINTMENTS;

  // Admin Routes /admin
  static readonly ADMIN_LOGIN_PAGE = "/admin/login";
  static readonly ADMIN_TOOLS_PAGE = "/admin/tools";
  static readonly ADMIN_TOOLS_RPC = "/admin/tools/rpc";
  static readonly ADMIN_TOOLS_REENCRYPT_PAGE = "/admin/tools/re-encrypt";
  static readonly ADMIN_TOOLS_WEBFLOW_IMPORTER =
    "/admin/tools/webflow-importer";
  static readonly ADMIN_TOOLS_VETS_LIST_CLINICS =
    "/admin/tools/vets/list-clinics";
  static readonly ADMIN_TOOLS_VETS_ADD_CLINIC = "/admin/tools/vets/add-clinic";
  static readonly ADMIN_TOOLS_VETS_VIEW_CLINIC = (vetId: string) =>
    `/admin/tools/vets/view-clinic/${vetId}`;
  static readonly ADMIN_TOOLS_USERS_LIST = "/admin/tools/users/list";
  static readonly ADMIN_TOOLS_USERS_VIEW = (userId: string) =>
    `/admin/tools/users/view/${userId}`;
  static readonly ADMIN_DEFAULT_LOGGED_IN_PAGE = RoutePath.ADMIN_TOOLS_PAGE;

  // API Routes /api
  static readonly API_VET_DOG_OWNER_DETAILS = (dogId: string) =>
    `/api/vet/dog-owners/${dogId}`;

  // External Links to WebFlow Website
  static readonly WEBSITE_ABOUT_US = "https://www.barkbank.co/about";
  static readonly WEBSITE_PRIVACY_POLICY =
    "https://www.barkbank.co/privacy-policy";
  static readonly WEBSITE_TERMS_OF_USE = "https://www.barkbank.co/terms-of-use";
  static readonly WEBSITE_FAQ_URL = "https://www.barkbank.co/faq";
  static readonly WEBSITE_URL = "https://www.barkbank.co/";
}
