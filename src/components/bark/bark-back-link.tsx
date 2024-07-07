import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function BarkBackLink(props: { href: string }) {
  const { href } = props;
  return (
    <Link className="flex flex-row gap-1" href={href}>
      <ChevronLeft />
      Back
    </Link>
  );
}
