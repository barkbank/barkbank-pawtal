import { redirect } from "next/navigation";
import { ReportsExplorer } from "./_components/reports-explorer";
import { RoutePath } from "@/lib/route-path";

export default async function Page() {
  redirect(RoutePath.VET_REPORTS_LIST);
  return <ReportsExplorer />;
}
