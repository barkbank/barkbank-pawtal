"use server";

import { BarkH2, BarkH4 } from "@/components/bark/bark-typography";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenSquare, X } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="m-3">
      <BarkH2>Reports</BarkH2>
      <div className="flex flex-col gap-3 rounded-md p-3 shadow-sm shadow-slate-400">
        <BarkH4>Pending Reports</BarkH4>
        <div className="flex flex-row items-center gap-3">
          <Input type="text" />
          <X />
        </div>
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Dog</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="">Albert Monroe</TableCell>
              <TableCell className="">Mape</TableCell>
              <TableCell className="">Singapore Special</TableCell>
              <TableCell className="flex flex-row gap-3">
                <Link href="/submit" className="flex flex-col items-center">
                  <PenSquare color="#0d9488" />
                  <p className="font-bold text-teal-600">Submit</p>
                </Link>
                <Link href="/cancel" className="flex flex-col items-center">
                  <X color="#db2777" />
                  <p className="font-bold text-pink-600">Cancel</p>
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 rounded-md  p-3 shadow-sm shadow-slate-400">
        <BarkH4>Reports</BarkH4>
        <p>Vet Add Reports</p>
      </div>
    </div>
  );
}
