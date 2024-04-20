import clsx from "clsx";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

export function BarkButton(props: {
  children: React.ReactNode;
  variant: "brand" | "brandInverse";
  className?: string;
  href?: string;
  onClick?: () => Promise<void>;
  type?: "button" | "submit" | "reset";
}) {
  const { children, variant, className, type, href, onClick } = props;

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
        type={type}
      >
        {children}
      </Button>
    );
  }
  return (
    <Button
      className={clsx("h-[60px]", className)}
      variant={variant}
      type={type}
    >
      {children}
    </Button>
  );
}
