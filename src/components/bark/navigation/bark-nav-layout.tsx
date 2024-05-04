"use client";

import { usePathname } from "next/navigation";
import { BarkNavRoute } from "./bark-nav-route";
import { DockOption } from "./_components/dock-option";
import { SideOption } from "./_components/side-option";

export function BarkNavLayout(props: {
  routes: BarkNavRoute[];
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  // note: when adjusting the height of the dock, make sure to update the bottom
  // padding of the footer
  return (
    <div id="bark-nav">
      <div className="flex flex-row">
        {/* Sidebar */}
        <div className="hidden min-h-screen w-[78px] flex-col items-center bg-brand px-[10px] py-[12px] md:flex md:w-[220px]">
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
        <div className="min-h-screen w-full flex-1">{props.children}</div>
      </div>

      {/* Dock */}
      <div className="fixed bottom-0 left-0 flex h-16 w-full flex-row items-center justify-center gap-6 bg-brand opacity-80 md:hidden">
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
