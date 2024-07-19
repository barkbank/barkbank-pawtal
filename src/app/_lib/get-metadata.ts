import { Metadata } from "next";

export function getMetadata(args: { title: string }): Metadata {
  const { title } = args;
  return { title: `${title} | Pawtal` };
}
