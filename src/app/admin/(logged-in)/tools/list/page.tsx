import { RoutePath } from "@/lib/route-path";
import { FileKey2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="m-3 grid grid-cols-1 gap-3 md:grid-cols-3">
      <Link
        className="x-card flex flex-col items-center gap-3 p-3"
        href={RoutePath.ADMIN_TOOLS_REENCRYPT_PAGE}
      >
        <FileKey2 />
        <p>Re-encrypt</p>
      </Link>
    </div>
  );
}
