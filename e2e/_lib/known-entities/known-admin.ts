import { PomAdmin } from "../pom/entities";

export function getKnownAdmin(): PomAdmin {
  return {
    adminEmail: "admin1@admin.com",
    adminName: "Oliver Jones",
    adminPhoneNumber: "+6580000001",
  };
}
