"use client";

import { usePathname } from "next/navigation";
import { BarkNavRoute } from "./bark-nav-route";
import { SideOption } from "./_components/side-option";

export function BarkSidebarLayout(props: {
  routes: BarkNavRoute[];
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <div className="flex min-h-screen w-[78px] flex-col items-center bg-brand px-[10px] py-[12px] md:w-[220px]">
        {props.routes.map((route) => {
          return (
            <SideOption
              key={route.label}
              route={route}
              currentPath={currentPath}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="w-full flex-1">{props.children}</div>
    </div>
  );
}
