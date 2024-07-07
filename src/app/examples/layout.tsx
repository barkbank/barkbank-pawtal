import APP from "@/lib/app";
import { BARKBANK_ENV } from "@/lib/barkbank-env";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  const env = APP.getBarkBankEnv();
  if (env !== BARKBANK_ENV.DEVELOPMENT) {
    redirect(RoutePath.ROOT);
  }
  return <>{children}</>;
}
