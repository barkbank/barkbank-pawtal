import { redirect } from "next/navigation";
import { RoutePath } from "@/lib/route-path";

export default async function Page() {
  redirect(RoutePath.VET_REPORTS_LIST);
}
