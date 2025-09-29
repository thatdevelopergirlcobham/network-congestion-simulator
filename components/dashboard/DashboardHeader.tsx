import AddUserModal from "./AddUserModal";

interface DashboardHeaderProps {
  onAddUser: () => void;
}

export default function DashboardHeader({ onAddUser }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AddUserModal onAddUser={onAddUser} />
    </div>
  );
}
