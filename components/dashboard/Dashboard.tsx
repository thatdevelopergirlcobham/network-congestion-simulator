import { useState, useEffect, useCallback } from "react";
import EventLog from "@/components/dashboard/EventLog";
import LiveChart from "@/components/dashboard/LiveChart";
import NetworkTopology from "@/components/dashboard/NetworkTopology";
import UserTable from "@/components/dashboard/UserTable";
import { dummyUsers } from "@/lib/dummy-data";
import { NetworkUser, NetworkMetrics, EventLog as EventLogType } from "@/types";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus } from "lucide-react";

export default function Dashboard() {
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [, setMetrics] = useState<NetworkMetrics[]>([]);
  const [, setEvents] = useState<EventLogType[]>([]);

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
  const refreshUsers = useCallback(() => {
    const savedUsers = localStorage.getItem('networkUsers');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers) as NetworkUser[];
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
      }
    }
  }, []);

  // Handle user updates
  const handleUserUpdate = useCallback((updatedUser: NetworkUser) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
      localStorage.setItem('networkUsers', JSON.stringify(updatedUsers));
      alert('User updated successfully');
      return updatedUsers;
    });
  }, []);

  // Handle user deletion
  const handleUserDelete = useCallback((userId: string) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.filter(user => user.id !== userId);
      localStorage.setItem('networkUsers', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    setIsSimulationRunning(prev => !prev);
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsSimulationRunning(false);
    setMetrics([]);
    setEvents([]);
    // Reset users to initial state
    setUsers(dummyUsers);
    localStorage.setItem('networkUsers', JSON.stringify(dummyUsers));
  }, []);
  // Run simulation effect
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      // Generate more realistic network metrics based on user count
      const baseThroughput = 20 + (Math.random() * 80); // 20-100 Mbps base
      const currentTime = Date.now();
      
      // Simulate network patterns (e.g., periodic congestion)
      const timeFactor = Math.sin(currentTime / 10000) * 0.5 + 0.5; // Oscillates between 0 and 1
      
      const newMetric: NetworkMetrics = {
        timestamp: currentTime,
        throughput: Math.max(5, baseThroughput * (0.8 + timeFactor * 0.4)), // 80-120% of base
        packetLoss: Math.min(5, users.length * 0.1 * (0.5 + Math.random())), // 0-5%, increases with users
        latency: 10 + (users.length * 2) + (Math.random() * 30 * timeFactor) // 10-60ms + user factor
      };

      setMetrics(prev => {
        // Keep only the last 50 data points
        const newMetrics = [...prev, newMetric];
        if (newMetrics.length > 50) {
          return newMetrics.slice(-50);
        }
        return newMetrics;
      });

      // Add events for significant changes
      if (Math.random() > 0.9) {
        let message = '';
        let type: 'info' | 'warning' | 'success' = 'info';
        
        if (newMetric.packetLoss > 3) {
          message = `High packet loss detected: ${newMetric.packetLoss.toFixed(1)}%`;
          type = 'warning';
        } else if (newMetric.latency > 50) {
          message = `High latency detected: ${Math.round(newMetric.latency)}ms`;
          type = 'warning';
        } else if (newMetric.throughput < 30) {
          message = `Low throughput: ${newMetric.throughput.toFixed(1)} Mbps`;
          type = 'warning';
        } else {
          const messages = [
            'Network operating normally',
            'Throughput optimized',
            'Connection stable',
            'All systems nominal'
          ];
          message = messages[Math.floor(Math.random() * messages.length)];
          type = 'info';
        }
        
        setEvents(prev => [
          {
            timestamp: new Date(currentTime).toLocaleTimeString(),
            message,
            type
          },
          ...prev
        ].slice(0, 50)); // Keep only the 50 most recent events
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, users.length]);
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Network Simulation Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isSimulationRunning ? "destructive" : "default"}
            onClick={toggleSimulation}
            className="gap-2 min-w-[120px]"
          >
            {isSimulationRunning ? (
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
            disabled={isSimulationRunning}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={refreshUsers} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
          <NetworkTopology />
          <LiveChart />
        </div>
        <div className="lg:col-span-1 space-y-4 md:space-y-6 lg:space-y-8">
          <UserTable 
            users={users} 
            onUserUpdate={handleUserUpdate}
            onUserDelete={handleUserDelete}
          />
          <EventLog />
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {isSimulationRunning ? (
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
