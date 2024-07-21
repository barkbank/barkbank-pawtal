import { RoutePath } from "@/lib/route-path";
import { FileKey2, Hospital } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const iconSize = 36;
  const toolSpecs: _ToolSpec[] = [
    {
      icon: <Hospital size={iconSize} />,
      name: "Vets",
      description: "Manage vet clinics and login accounts",
      href: RoutePath.ADMIN_TOOLS_VETS_LIST_CLINICS,
    },
    {
      icon: <FileKey2 size={iconSize} />,
      name: "Re-encrypt",
      description:
        "Re-encrypts all encrypted values using the latest encryption key",
      href: RoutePath.ADMIN_TOOLS_REENCRYPT_PAGE,
    },
  ];

  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="prose">
        <h1>Tools</h1>
        <p>A collection of tools for administrators.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {toolSpecs.map((spec) => (
          <_ToolLink key={spec.name} spec={spec} />
        ))}
      </div>
    </div>
  );
}

type _ToolSpec = {
  icon: React.ReactNode;
  name: string;
  description: string;
  href: string;
};

function _ToolLink(props: { spec: _ToolSpec }) {
  const { spec } = props;
  const { icon, name, description, href } = spec;
  return (
    <Link className="x-card flex flex-col items-center gap-3 p-3" href={href}>
      {icon}
      <p className="text-center text-base font-semibold">{name}</p>
      <p className="text-center text-base font-light">{description}</p>
    </Link>
  );
}
