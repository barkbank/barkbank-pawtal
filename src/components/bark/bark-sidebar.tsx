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
      return route.iconSrc || "/square.svg";
    } else {
      return route.iconLightSrc || "/square-light.svg";
    }
  })();
  return (
    <Link href={route.href}>
      <div
        className={clsx(
          "flex w-[200px] flex-col items-center justify-center gap-[7px] rounded-[20px] px-[20px] py-[16px]",
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
        />

        {/* Label */}
        <div className="w-full text-center text-[14px] font-[700] leading-[20px]">
          {route.label}
        </div>
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
      <div className="flex min-h-screen w-[220px] flex-col items-center bg-brand py-[12px]">
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
