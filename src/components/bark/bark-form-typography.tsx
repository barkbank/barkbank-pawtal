import React from "react";

export function BarkFormHeader(props: { children: React.ReactNode }) {
  return <p className="text-lg">{props.children}</p>;
}

export function BarkFormParagraph(props: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{props.children}</p>;
}

export function BarkFormErrorParagraph(props: { children: React.ReactNode }) {
  return <p className="text-sm text-destructive">{props.children}</p>;
}
