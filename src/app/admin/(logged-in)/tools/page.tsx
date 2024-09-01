import APP from "@/lib/app";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import {
  AdminPermissions,
  AdminPermissionsSchema,
} from "@/lib/bark/models/admin-models";
import { RoutePath } from "@/lib/route-path";
import {
  Braces,
  FileKey2,
  Hospital,
  Import,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const rootAdminEmail = APP.getRootAdminEmail();
  const actor = (await getAuthenticatedAdminActor())!;
  const account = (await actor.getOwnAdminAccount()).result!;
  const { adminEmail } = account;
  const isRoot = adminEmail === rootAdminEmail;
  const iconSize = 36;
  const toolSpecs: _ToolSpec[] = [
    {
      icon: <Users size={iconSize} />,
      name: "Users",
      description: "Manage user accounts",
      href: RoutePath.ADMIN_TOOLS_USERS_LIST,
      show: account.adminCanManageUserAccounts,
    },
    {
      icon: <Hospital size={iconSize} />,
      name: "Vets",
      description: "Manage vet clinics and login accounts",
      href: RoutePath.ADMIN_TOOLS_VETS_LIST_CLINICS,
      show: account.adminCanManageVetAccounts,
    },
    {
      icon: <Shield size={iconSize} />,
      name: "Admins",
      description: "Manage admin accounts",
      href: RoutePath.ADMIN_TOOLS_ADMINS_LIST,
      show: account.adminCanManageAdminAccounts,
    },
    {
      icon: <Braces size={iconSize} />,
      name: "RPC",
      description: "Admin RPC Commands",
      href: RoutePath.ADMIN_TOOLS_RPC,
      show: isRoot,
    },
    {
      icon: <FileKey2 size={iconSize} />,
      name: "Re-encrypt",
      description:
        "Re-encrypts all encrypted values using the latest encryption key",
      href: RoutePath.ADMIN_TOOLS_REENCRYPT_PAGE,
      show: isRoot,
    },
    {
      icon: <Import size={iconSize} />,
      name: "WebFlow Importer",
      description: "Import WebFlow registraitons",
      href: RoutePath.ADMIN_TOOLS_WEBFLOW_IMPORTER,
      show: isRoot,
    },
  ];

  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="prose">
        <h1>Tools</h1>
        <p>A collection of tools for administrators.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {toolSpecs.map((spec) => {
          if (!spec.show) {
            return null;
          }
          return <_ToolLink key={spec.name} spec={spec} />;
        })}
      </div>
    </div>
  );
}

type _ToolSpec = {
  icon: React.ReactNode;
  name: string;
  description: string;
  href: string;
  show: boolean;
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
