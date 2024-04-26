import path from "path";
import fs from "fs";
import { BarkH1 } from "@/components/bark/bark-typography";

export default async function Page() {
  const filePath = path.resolve(
    process.cwd(),
    "src",
    "resources",
    "git-commit-hash.txt",
  );
  const commitHash = fs.readFileSync(filePath, "utf-8").trim();
  const info = { commitHash };
  return (
    <div className="m-3 min-h-screen">
      <BarkH1>Version</BarkH1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}
