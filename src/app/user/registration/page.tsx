import APP from "@/lib/app";
import DonorForm from "./_components/donor-form";
import { Pool } from "pg";
import { BarkFormOption } from "@/components/bark/bark-form";
import { dbQuery } from "@/lib/data/db-utils";

export default async function Example() {
  const [breedService, dbPool] = await Promise.all([
    APP.getBreedService(),
    APP.getDbPool(),
  ]);
  const [breeds, vetOptions] = await Promise.all([
    breedService.getAllBreeds(),
    loadVetFormOptions(dbPool),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <DonorForm breeds={breeds} vetOptions={vetOptions} />
    </main>
  );
}

// TODO: Leave this here or move it?
async function loadVetFormOptions(dbPool: Pool): Promise<BarkFormOption[]> {
  const sql = `
    SELECT vet_id, vet_name, vet_address
    FROM vets
    ORDER BY vet_name
  `;
  const res = await dbQuery(dbPool, sql, []);
  return res.rows.map((row) => {
    return {
      value: row.vet_id,
      label: `${row.vet_name} — ${row.vet_address}`,
    };
  });
}
