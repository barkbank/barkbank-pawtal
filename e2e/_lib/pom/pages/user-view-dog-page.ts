import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";

export class UserViewDogPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_VIEW_DOG_REGEX;
  }
}
