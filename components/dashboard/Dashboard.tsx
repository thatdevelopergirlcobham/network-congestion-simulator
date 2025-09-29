'use client';
import { useEffect, useCallback } from "react";
import EventLog from "@/components/dashboard/EventLog";
import LiveChart from "@/components/dashboard/LiveChart";
import NetworkTopology from "@/components/dashboard/NetworkTopology";
import UserTable from "@/components/dashboard/UserTable";
import AddUserModal from "@/components/dashboard/AddUserModal";
import { NetworkUser } from "@/types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useSimulation, SimulationProvider } from "@/context/SimulationContext";

function DashboardContent() {
  const {
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    users,
    nodes, // eslint-disable-line @typescript-eslint/no-unused-vars
    metricsHistory, // eslint-disable-line @typescript-eslint/no-unused-vars
    eventLog // eslint-disable-line @typescript-eslint/no-unused-vars
  } = useSimulation();

  // Load users from localStorage on component mount (for compatibility)
  useEffect(() => {
    const savedUsers = localStorage.getItem("networkUsers");
    if (savedUsers) {
      try {
        JSON.parse(savedUsers) as NetworkUser[];
        // Users are managed by SimulationContext, no need to use parsed data
      } catch (error) {
        console.error("Error parsing users from localStorage:", error);
      }
    }
  }, []);

  // Handle user updates - update in localStorage
  const handleUserUpdate = useCallback((updatedUser: NetworkUser) => {
    // Get existing users from localStorage
    const savedUsers = localStorage.getItem("networkUsers");
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers) as NetworkUser[];
        // Update the user
        const updatedUsers = users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        );
        // Save back to localStorage
        localStorage.setItem("networkUsers", JSON.stringify(updatedUsers));
        alert("User updated successfully");
        // Force page refresh to show updated user data
        window.location.reload();
      } catch (error) {
        console.error("Error updating user in localStorage:", error);
        alert("Error updating user");
      }
    }
  }, []);

  // Handle user deletion - remove from localStorage
  const handleUserDelete = useCallback((userId: string) => {
    // Get existing users from localStorage
    const savedUsers = localStorage.getItem("networkUsers");
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers) as NetworkUser[];
        // Remove the user
        const filteredUsers = users.filter(user => user.id !== userId);
        // Save back to localStorage
        localStorage.setItem("networkUsers", JSON.stringify(filteredUsers));
        alert("User deleted successfully");
        // Force page refresh to show updated user list
        window.location.reload();
      } catch (error) {
        console.error("Error deleting user from localStorage:", error);
        alert("Error deleting user");
      }
    }
  }, []);

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    if (isRunning) {
      pauseSimulation();
    } else {
      startSimulation();
    }
  }, [isRunning, startSimulation, pauseSimulation]);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Network Simulation Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isRunning ? "destructive" : "default"}
            onClick={toggleSimulation}
            className="gap-2 min-w-[120px]"
          >
            {isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Stop
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={resetSimulation}
            className="gap-2"
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <AddUserModal />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
          <NetworkTopology />
          {/* Chart pulls from context */}
          <LiveChart />
        </div>
        <div className="lg:col-span-1 space-y-4 md:space-y-6 lg:space-y-8">
          <UserTable
            users={users}
            onUserUpdate={handleUserUpdate}
            onUserDelete={handleUserDelete}
          />
          {/* Event log pulls from context */}
          <EventLog />
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {isRunning ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Simulation is running</span>
          </div>
        ) : (
          <div className="text-muted-foreground">Simulation is paused</div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SimulationProvider>
      <DashboardContent />
    </SimulationProvider>
  );
}
