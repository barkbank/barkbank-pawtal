import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";

export class UserEditDogPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_EDIT_DOG_REGEX;
  }
}
