import clsx from "clsx";

export function BarkError(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("text-base text-destructive", props.className)}>
      {props.children}
    </div>
  );
}
