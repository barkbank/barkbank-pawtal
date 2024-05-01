import { Locator } from "@playwright/test";
import { PomPage } from "../core/pom-page";

export abstract class AbstractLoginPage extends PomPage {
  emailField(): Locator {
    return this.page().getByLabel("Please provide your email");
  }

  sendMeAnOtpButton(): Locator {
    return this.page().getByRole("button", {
      name: "Send me an OTP",
    });
  }

  otpSentMessage(): Locator {
    return this.page().getByText("An OTP has been sent to");
  }

  otpField(): Locator {
    return this.page().getByLabel("Enter OTP");
  }

  loginButton(): Locator {
    return this.page().getByRole("button", { name: "Login" });
  }

  registerLink(): Locator {
    return this.page().getByRole("link", { name: "register here" });
  }

  invalidEmailErrorMessage(): Locator {
    return this.page().getByText("Invalid email");
  }

  otpCannotBeEmptyErrorMessage(): Locator {
    return this.page().getByText("OTP cannot be empty");
  }
}
