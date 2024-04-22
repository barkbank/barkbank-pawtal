import { SidebarComponent } from "./sidebar-component";
import { PomPage } from "./pom-core";
import { NavbarComponent } from "./navbar-component";
import { FooterComponent } from "./footer-component";

export abstract class PawtalPage extends PomPage {
  navbar(): NavbarComponent {
    return new NavbarComponent(this.context());
  }

  sidebar(): SidebarComponent {
    return new SidebarComponent(this.context());
  }

  footer(): FooterComponent {
    return new FooterComponent(this.context());
  }
}
