import clsx from "clsx";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

export function BarkButton(props: {
  children: React.ReactNode;
  variant: "brand" | "brandInverse";
  className?: string;
  href?: string;
  onClick?: () => Promise<void>;
}) {
  const { children, variant, className, href, onClick } = props;

  if (href !== undefined) {
    return (
      <Link
        className={clsx("h-[60px]", className, buttonVariants({ variant }))}
        href={href}
      >
        {children}
      </Link>
    );
  }
  if (onClick !== undefined) {
    return (
      <Button
        className={clsx("h-[60px]", className)}
        variant={variant}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }
  return (
    <Button className={clsx("h-[60px]", className)} variant={variant}>
      {children}
    </Button>
  );
}
