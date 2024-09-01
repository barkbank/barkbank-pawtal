import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function BarkBackLink(props: {
  href: string;
  text?: string | undefined;
}) {
  const { href, text } = props;
  const buttonLabel = text ?? "Back";
  return (
    <Link className="flex flex-row gap-1" href={href}>
      <ChevronLeft />
      {buttonLabel}
    </Link>
  );
}
