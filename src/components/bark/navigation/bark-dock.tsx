"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { IMG_PATH } from "@/lib/image-path";
import { BarkNavRoute } from "./bark-nav-route";

function DockOption(props: { route: BarkNavRoute; currentPath: string }) {
  const { route, currentPath } = props;
  const isActive = currentPath.startsWith(route.href);
  const iconSrc = (() => {
    if (isActive) {
      return route.iconSrc || IMG_PATH.SIDEBAR_DOG;
    } else {
      return route.iconLightSrc || IMG_PATH.SIDEBAR_DOG_LIGHT;
    }
  })();
  return (
    <Link href={route.href}>
      <div className="flex flex-col items-center justify-center gap-1 ">
        <div
          className={clsx(
            "flex w-8 flex-col items-center justify-center rounded-[16px] px-1 py-1",
            {
              "bg-brand text-brand-white": !isActive,
              "bg-brand-white text-brand": isActive,
            },
          )}
        >
          {/* Icon */}
          <Image
            src={iconSrc}
            alt={`Icon for the ${route.label} option`}
            width={30}
            height={30}
            className="h-6 w-6"
          />
        </div>
        {/* Label */}
        <div className="w-full text-xs text-white">{route.label}</div>
      </div>
    </Link>
  );
}

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
