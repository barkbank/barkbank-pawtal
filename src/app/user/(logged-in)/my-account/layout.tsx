import { getMetadata } from "@/app/_lib/get-metadata";

export const metadata = getMetadata({ title: "Account" });

export default async function Layout(props: { children: React.ReactNode }) {
  return props.children;
}
