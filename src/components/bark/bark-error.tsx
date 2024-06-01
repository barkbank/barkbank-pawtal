export function BarkError(props: { children: React.ReactNode }) {
  return (
    <div className="mt-3 text-base text-destructive">{props.children}</div>
  );
}
