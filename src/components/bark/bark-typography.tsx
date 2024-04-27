export function BarkH1(props: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {props.children}
    </h1>
  );
}

export function BarkH2(props: { children: React.ReactNode }) {
  return (
    <h1 className="pb-2 text-3xl font-semibold tracking-tight lg:text-4xl">
      {props.children}
    </h1>
  );
}

export function BarkH3(props: { children: React.ReactNode, }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {props.children}
    </h3>
  );
}

export function BarkH4(props: { children: React.ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {props.children}
    </h4>
  );
}

export function BarkH5(props: { children: React.ReactNode }) {
  return (
    <h5 className="scroll-m-20 text-base font-semibold tracking-tight">
      {props.children}
    </h5>
  );
}

export function BarkP(props: { children: React.ReactNode; classes?: string }) {
  return (
    <p className={`${props.classes} leading-7 [&:not(:first-child)]:mt-6`}>
      {props.children}
    </p>
  );
}
