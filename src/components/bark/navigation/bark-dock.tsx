"use client";

import { usePathname } from "next/navigation";
import { BarkNavRoute } from "./bark-nav-route";
import { DockOption } from "./_components/dock-option";

export function BarkDockLayout(props: {
  routes: BarkNavRoute[];
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  // note: when adjusting the height of the dock, make sure to update the bottom
  // padding of the footer
  return (
    <div>
      {/* Content */}
      <div>{props.children}</div>

      {/* Dock */}
      <div
        className="fixed bottom-0 left-0 flex h-16 w-full flex-row items-center justify-center gap-6 bg-brand"
      >
        {props.routes.map((route) => {
          return (
            <DockOption
              key={route.label}
              route={route}
              currentPath={currentPath}
            />
          );
        })}
      </div>
    </div>
  );
}
