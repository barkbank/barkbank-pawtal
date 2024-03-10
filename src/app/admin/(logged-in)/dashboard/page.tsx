"use server";

import { BarkH1, BarkH2, BarkP } from "@/components/bark/bark-typography";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminActor } from "@/lib/admin/admin-actor";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { BARK_UTC } from "@/lib/bark-utils";
import { DogGender, YesNoUnknown } from "@/lib/data/db-models";
import { RoutePath } from "@/lib/route-path";
import clsx from "clsx";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor: AdminActor | null = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const incompleteProfiles = await actor.getIncompleteProfileList();
  return (
    <>
      <div className="mt-6 rounded-md p-6 shadow-md">
        <BarkH2>Incomplete Profiles</BarkH2>
        <Table>
          <TableCaption>A list of incomplete dog profiles.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">ID</TableHead>
              <TableHead className="w-8">Breed</TableHead>
              <TableHead className="w-8 text-center">Gender</TableHead>
              <TableHead className="w-8 text-center">Weight</TableHead>
              <TableHead className="w-8">Birthday</TableHead>
              <TableHead className="w-8 text-center">Ever Pregnant</TableHead>
              <TableHead className="w-8 text-center">
                Ever Received Blood Transfusion
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incompleteProfiles.map((profile) => {
              return (
                <TableRow key={profile.dogId}>
                  <TableCell>{profile.dogId}</TableCell>
                  <TableCell
                    className={clsx({
                      "bg-orange-100": profile.dogBreed === "",
                    })}
                  >
                    {profile.dogBreed}
                  </TableCell>
                  <TableCell
                    className={clsx("text-center", {
                      "bg-orange-100": profile.dogGender === DogGender.UNKNOWN,
                    })}
                  >
                    {profile.dogGender}
                  </TableCell>
                  <TableCell
                    className={clsx("text-center", {
                      "bg-orange-100": profile.dogWeightKg === null,
                    })}
                  >
                    {profile.dogWeightKg !== null
                      ? `${profile.dogWeightKg} KG`
                      : "UNKNOWN"}
                  </TableCell>
                  <TableCell
                    className={clsx({
                      "bg-orange-100": profile.dogBirthday.getTime() === 0,
                    })}
                  >
                    {profile.dogBirthday.getTime() > 0
                      ? BARK_UTC.formatDate(profile.dogBirthday)
                      : ""}
                  </TableCell>
                  <TableCell
                    className={clsx("text-center", {
                      "bg-orange-100":
                        profile.dogEverPregnant === YesNoUnknown.UNKNOWN,
                    })}
                  >
                    {profile.dogEverPregnant}
                  </TableCell>
                  <TableCell
                    className={clsx("text-center", {
                      "bg-orange-100":
                        profile.dogEverReceivedTransfusion ===
                        YesNoUnknown.UNKNOWN,
                    })}
                  >
                    {profile.dogEverReceivedTransfusion}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
