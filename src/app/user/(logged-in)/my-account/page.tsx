"use server";

import { BarkH1, BarkH4 } from "@/components/bark/bark-typography";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { UserPii } from "@/lib/data/db-models";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { IMG_PATH } from "@/lib/image-path";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const ownPii: UserPii | null = await actor.getOwnUserPii();
  if (!ownPii) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const { userName, userEmail, userPhoneNumber } = ownPii;

  return (
    <main className="flex flex-col gap-6">
      <BarkH1>My Account Details</BarkH1>

      <div>
        <div className="mb-[7px] flex flex-col gap-[7px]">
          <BarkH4>{userName}</BarkH4>
          <p className="text-grey-60 text-xs">
            {/* TODO: Update with data */}
            Account created on: {"<TO BE UPDATED>"}
          </p>
          {/* TODO: Update with data */}
          <p className="text-grey-60 text-xs">
            Last contacted: {"<TO BE UPDATED>"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-[10px]">
            <Image
              src={IMG_PATH.LOCATION_MARKER}
              width={25}
              height={20}
              alt="location marker icon"
            />
            Singpapore
          </p>
          <p className="flex items-center gap-[10px]">
            <Image
              src={IMG_PATH.LETTER}
              width={25}
              height={20}
              alt="letter icon"
            />
            {userEmail}
          </p>
          <p className="flex items-center gap-[10px]">
            <Image
              src={IMG_PATH.PHONE}
              width={25}
              height={20}
              alt="phone icon icon"
            />
            {userPhoneNumber}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold">User ID Number</p>
        {/* TODO: Update with data */}
        <p>{"<TO BE UPDATED>"}</p>
      </div>
      <div className="flex gap-3">
        <Link
          className={buttonVariants({ variant: "brand" })}
          href={"/user/my-account/edit"}
        >
          Edit
        </Link>
        <Button variant={"brandInverse"}>Delete</Button>
      </div>
    </main>
  );
}
