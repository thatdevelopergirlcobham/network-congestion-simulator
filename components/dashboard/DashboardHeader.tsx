import AddUserModal from "@/components/dashboard/AddUserModal";

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AddUserModal />
    </div>
  );
}
