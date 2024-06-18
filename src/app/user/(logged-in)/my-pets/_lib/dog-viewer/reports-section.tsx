import { Separator } from "@/components/ui/separator";
import { DogViewerData } from "./dog-viewer-data";

export function ReportsSection(props: { data: DogViewerData }) {
  const { dogReports } = props.data;

  return (
    <div className="x-card flex flex-col gap-3">
      <p className="x-card-title">Reports</p>
      <Separator />
      <pre>{JSON.stringify(dogReports, null, 2)}</pre>
    </div>
  );
}
