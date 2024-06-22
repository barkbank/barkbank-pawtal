export function SimpleErrorPage(props: { error: string }) {
  const { error } = props;
  return <div className="m-3">Oops! There was an error: {error}</div>;
}
