
export const UI_URLS = {
  USER_LOGIN: "http://localhost:3000/user/login",
  USER_MY_PETS: "http://localhost:3000/user/my-pets",
  ROOT: "http://localhost:3000/",
} as const;

export const UI_USER = {
  EMAIL: "test_user@user.com",
  ELIGIBLE_DOG_NAME: "Mape",
  TEMPORARILY_INELIGIBLE_DOG_NAME: "Ridley",
  PERMANENTLY_INELIGIBLE_DOG_NAME: "Perry",
} as const;
