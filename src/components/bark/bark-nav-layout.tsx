"use client";

import { BarkNavRoute } from "./bark-nav-route";
import { BarkDockLayout } from "./bark-dock";
import { BarkSidebarLayout } from "./bark-sidebar";

export default function BarkNavLayout(props: { routes: BarkNavRoute[], children: React.ReactNode }) {
  const {routes, children} = props;

  return (
    <>
      <div className="md:hidden">
        <BarkDockLayout routes={routes}>{props.children}</BarkDockLayout>
      </div>
      <div className="hidden md:block">
        <BarkSidebarLayout routes={routes}>{props.children}</BarkSidebarLayout>
      </div>
    </>
  );
}
