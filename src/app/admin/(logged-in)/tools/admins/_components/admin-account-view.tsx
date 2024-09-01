import { AdminAccount } from "@/lib/bark/models/admin-models";

export function AdminAccountView(props: { account: AdminAccount }) {
  const { account } = props;
  const {
    adminId,
    adminName,
    adminEmail,
    adminPhoneNumber,
    adminCanManageAdminAccounts,
    adminCanManageVetAccounts,
    adminCanManageUserAccounts,
    adminCanManageDonors,
  } = account;

  return (
    <div className="prose">
      <h1>{adminName}</h1>
      <p>Account ID: {adminId}</p>
      <p>Email: {adminEmail}</p>
      <p>Phone: {adminPhoneNumber}</p>
      <h2>Permissions</h2>
      <ul>
        <_Permission
          label="manage admin accounts"
          value={adminCanManageAdminAccounts}
        />
        <_Permission
          label="manage vet accounts"
          value={adminCanManageVetAccounts}
        />
        <_Permission
          label="manage user accounts"
          value={adminCanManageUserAccounts}
        />
        <_Permission label="manage donors" value={adminCanManageDonors} />
      </ul>
    </div>
  );
}

function _Permission(props: { label: string; value: boolean }) {
  const { label, value } = props;
  if (value) {
    return (
      <li>
        <b>Can {label}</b>
      </li>
    );
  }
  return <li>Cannot {label}</li>;
}
