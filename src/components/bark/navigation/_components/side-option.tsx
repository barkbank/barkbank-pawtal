"use client";

import { IMG_PATH } from "@/lib/image-path";
import { BarkNavRoute } from "../bark-nav-route";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export function SideOption(props: {
  route: BarkNavRoute;
  currentPath: string;
}) {
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
      <div
        className={clsx(
          "flex w-[58px] flex-col items-center justify-center gap-[7px] rounded-[20px] px-[16px] py-[16px] md:w-[200px] md:px-[20px]",
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
          className="h-[24px] w-[24px] md:h-[30px] md:w-[30px]"
        />

        {/* Label */}
        <div className="hidden w-full text-center text-[14px] font-[700] leading-[20px] md:block">
          {route.label}
        </div>
      </div>
    </Link>
  );
}
