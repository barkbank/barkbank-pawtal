"use client";

import { BarkH2 } from "@/components/bark/bark-typography";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { IncompleteProfile } from "@/lib/admin/admin-models";

function DataRow(props: { profile: IncompleteProfile }) {
  const { profile } = props;
  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => {
        const jsonEncoded = JSON.stringify(profile, null, 2);
        const msg = `
TODO: Something here containing dog name
and owner contact details for the admin to reach out
and update. In the meantime, here is a beautiful JSON:
${jsonEncoded}
`.trim();
        alert(msg);
      }}
    >
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
          "bg-orange-100": profile.dogGender === DOG_GENDER.UNKNOWN,
        })}
      >
        {profile.dogGender}
      </TableCell>
      <TableCell
        className={clsx("text-center", {
          "bg-orange-100": profile.dogWeightKg === null,
        })}
      >
        {profile.dogWeightKg !== null ? `${profile.dogWeightKg} KG` : "UNKNOWN"}
      </TableCell>
      <TableCell
        className={clsx({
          "bg-orange-100": profile.dogBirthday.getTime() === 0,
        })}
      >
        {profile.dogBirthday.getTime() > 0
          ? formatDateTime(profile.dogBirthday, SGT_UI_DATE)
          : ""}
      </TableCell>
      <TableCell
        className={clsx("text-center", {
          "bg-orange-100": profile.dogEverPregnant === YES_NO_UNKNOWN.UNKNOWN,
        })}
      >
        {profile.dogEverPregnant}
      </TableCell>
      <TableCell
        className={clsx("text-center", {
          "bg-orange-100":
            profile.dogEverReceivedTransfusion === YES_NO_UNKNOWN.UNKNOWN,
        })}
      >
        {profile.dogEverReceivedTransfusion}
      </TableCell>
    </TableRow>
  );
}

export function IncompleteProfiles(props: { profiles: IncompleteProfile[] }) {
  const { profiles } = props;
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
            {profiles.map((profile) => (
              <DataRow key={profile.dogId} profile={profile} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
