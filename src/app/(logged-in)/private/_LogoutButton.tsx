"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function LogoutButton(props: {children: React.ReactNode}) {
  const onClick = async () => {
    signOut();
  }
  return (<><Button onClick={onClick}>{props.children}</Button></>)
}
