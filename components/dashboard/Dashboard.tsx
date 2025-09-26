import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EventLog from "@/components/dashboard/EventLog";
import LiveChart from "@/components/dashboard/LiveChart";
import NetworkTopology from "@/components/dashboard/NetworkTopology";
import UserTable from "@/components/dashboard/UserTable";
import { dummyUsers } from "@/lib/dummy-data";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      <DashboardHeader />
      <main className="flex-grow mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <NetworkTopology />
            <LiveChart />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <UserTable users={dummyUsers} />
            <EventLog />
          </div>
        </div>
      </main>
    </div>
  );
}
