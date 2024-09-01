import clsx from "clsx";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

type _BaseProps = {
  children: React.ReactNode;
  variant: "brand" | "brandInverse" | "default" | "secondary" | "destructive";
  className?: string;
  disabled?: boolean;
};

type _LinkProps = _BaseProps & {
  href: string;
  type?: undefined;
  onClick?: undefined;
};

type _ButtonProps = _BaseProps & {
  href?: undefined;
  type: "button" | "submit" | "reset";
  onClick?: (() => Promise<void>) | (() => void);
};

export function BarkButton(props: _LinkProps | _ButtonProps) {
  const { children, variant, className, disabled, href, type, onClick } = props;

  // Disabled button
  if (disabled === true) {
    return (
      <Button
        className={clsx("h-[60px]", className)}
        variant={variant}
        type="button"
        disabled={true}
      >
        {children}
      </Button>
    );
  }

  // Link button
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

  // Button with onClick
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

  // Just a button, typically "submit"
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
