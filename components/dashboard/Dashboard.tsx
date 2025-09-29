import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EventLog from "@/components/dashboard/EventLog";
import LiveChart from "@/components/dashboard/LiveChart";
import NetworkTopology from "@/components/dashboard/NetworkTopology";
import UserTable from "@/components/dashboard/UserTable";
import { dummyUsers } from "@/lib/dummy-data";
import { NetworkUser } from "@/types";

export default function Dashboard() {
  const [users, setUsers] = useState<NetworkUser[]>([]);

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('networkUsers');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers) as NetworkUser[];
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
        // Fallback to dummy data if there's an error
        setUsers(dummyUsers);
        localStorage.setItem('networkUsers', JSON.stringify(dummyUsers));
      }
    } else {
      // If no users in localStorage, use dummy data
      setUsers(dummyUsers);
      localStorage.setItem('networkUsers', JSON.stringify(dummyUsers));
    }
  }, []);

  // Function to refresh users from localStorage
  const refreshUsers = () => {
    const savedUsers = localStorage.getItem('networkUsers');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers) as NetworkUser[];
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
      }
    }
  };
  return (
    <div className="flex flex-col min-h-screen p-8">
      <DashboardHeader onAddUser={refreshUsers} />
      <main className="flex-grow mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <NetworkTopology />
            <LiveChart />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <UserTable users={users} />
            <EventLog />
          </div>
        </div>
      </main>
    </div>
  );
}
