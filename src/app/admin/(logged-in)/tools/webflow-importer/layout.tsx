import { getMetadata } from "@/app/_lib/get-metadata";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export const metadata = getMetadata({ title: "Webflow Importer" });

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = (await getAuthenticatedAdminActor())!;
  const isRoot = await actor.getIsRoot();
  if (!isRoot) {
    redirect(RoutePath.ADMIN_TOOLS_PAGE);
  }
  return props.children;
}
