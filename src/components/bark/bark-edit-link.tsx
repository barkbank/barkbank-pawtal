import { Edit } from "lucide-react";
import Link from "next/link";

export function BarkEditLink(props: { href: string }) {
  const { href } = props;
  return (
    <Link href={href}>
      <Edit color="#555" />
    </Link>
  );
}
