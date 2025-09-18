// import Image from "next/image";
import SimulationControls from "@/components/controls/SimulationControls";
import EventLog from "@/components/dashboard/EventLog";
import LiveChart from "@/components/dashboard/LiveChart";
import NetworkTopology from "@/components/dashboard/NetworkTopology";
import UserList from "@/components/dashboard/UserList";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-4 md:p-6 lg:p-8 bg-gradient-to-br from-[#0a192f] to-background min-h-[calc(100vh-69px)]">
        <SimulationControls />
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <NetworkTopology />
              <LiveChart />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <UserList />
              <EventLog />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
