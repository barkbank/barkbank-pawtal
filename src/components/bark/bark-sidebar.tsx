"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

export type BarkSidebarRoute = {
  label: string;
  href: string;
  iconSrc?: string;
  iconLightSrc?: string;
};

function SideOption(props: { route: BarkSidebarRoute; currentPath: string }) {
  const { route, currentPath } = props;
  const isActive = route.href.startsWith(currentPath);
  const iconSrc = (() => {
    if (isActive) {
      return route.iconLightSrc || "/square-light.svg";
    } else {
      return route.iconSrc || "/square.svg";
    }
  })();
  return (
    <Link href={route.href}>
      <div
        className={clsx(
          "flex w-[200px] items-center justify-center gap-[12px] rounded-[20px] px-[20px] py-[16px]",
          {
            "bg-brand-white text-black": !isActive,
            "bg-brand text-brand-white": isActive,
          },
        )}
      >
        {/* Icon */}
        <Image
          src={iconSrc}
          alt={`Icon for the ${route.label} option`}
          width={18}
          height={18}
        />

        {/* Label */}
        <div className="w-full text-[14px]">{route.label}</div>
      </div>
    </Link>
  );
}

export function BarkSidebarLayout(props: {
  routes: BarkSidebarRoute[];
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <div className="h-screen w-[220px] bg-brand-white">
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
      <div className="w-full flex-1 p-3">{props.children}</div>
    </div>
  );
}
