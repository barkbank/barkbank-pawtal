import clsx from "clsx";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

export function BarkButton(props: {
  children: React.ReactNode;
  variant: "brand" | "brandInverse";
  className?: string;
  href?: string;
  onClick?: (() => Promise<void>) | (() => void);
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const { children, variant, className, disabled, href, onClick } = props;
  const type = props.type ?? "button";

  if (href !== undefined && disabled !== true) {
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
        disabled={disabled}
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
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
