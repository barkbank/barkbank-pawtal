import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page() {
  redirect(RoutePath.VET_APPOINTMENTS_LIST);
}
