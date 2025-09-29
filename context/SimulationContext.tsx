'use client';
import { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import { NetworkNode, NetworkUser, NetworkMetrics, CongestionAlgorithm, EventLog } from '@/types';
import { runSimulationStep } from '@/lib/simulation';

const STORAGE_KEY = 'network-simulation-users';

const initialNodes: NetworkNode[] = [
  { id: 'user-a', type: 'user', congestionLevel: 0 }, 
  { id: 'router-1', type: 'router', congestionLevel: 0 },
  { id: 'router-2', type: 'router', congestionLevel: 0 }, 
  { id: 'server-x', type: 'server', congestionLevel: 0 },
];

const getInitialUsers = (): NetworkUser[] => {
  if (typeof window === 'undefined') {
    return [
      { id: 'user-1', name: 'User A (Video)', trafficType: 'Video Stream', sendingRate: 25 },
      { id: 'user-2', name: 'User B (Download)', trafficType: 'File Download', sendingRate: 30 },
    ];
  }
  
  try {
    const savedUsers = localStorage.getItem(STORAGE_KEY);
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
  } catch (error) {
    console.error('Failed to parse saved users from localStorage', error);
  }
  
  return [
    { id: 'user-1', name: 'User A (Video)', trafficType: 'Video Stream', sendingRate: 25 },
    { id: 'user-2', name: 'User B (Download)', trafficType: 'File Download', sendingRate: 30 },
  ];
};

interface SimulationContextType {
  isRunning: boolean; 
  nodes: NetworkNode[]; 
  users: NetworkUser[]; 
  metricsHistory: NetworkMetrics[];
  eventLog: EventLog[]; 
  activeAlgorithm: CongestionAlgorithm; 
  startSimulation: () => void;
  pauseSimulation: () => void; 
  resetSimulation: () => void; 
  addUser: (user: Omit<NetworkUser, 'id'>) => void;
  removeUser: (userId: string) => void; 
  setAlgorithm: (algorithm: CongestionAlgorithm) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [users, setUsers] = useState<NetworkUser[]>(getInitialUsers);
  const [metricsHistory, setMetricsHistory] = useState<NetworkMetrics[]>([]);
  const [eventLog, setEventLog] = useState<EventLog[]>([]);
  const [activeAlgorithm, setAlgorithm] = useState<CongestionAlgorithm>('TCP Reno');
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Save users to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to localStorage', error);
    }
  }, [users]);

  const addEvent = useCallback((log: EventLog) => {
    setEventLog(prev => [log, ...prev.slice(0, 49)]);
  }, []);

  const startSimulation = useCallback(() => { 
    setIsRunning(true); 
    addEvent({ 
      timestamp: new Date().toLocaleTimeString(), 
      message: 'Simulation started.', 
      type: 'success' 
    }); 
  }, [addEvent]);

  const pauseSimulation = useCallback(() => { 
    setIsRunning(false); 
    addEvent({ 
      timestamp: new Date().toLocaleTimeString(), 
      message: 'Simulation paused.', 
      type: 'info' 
    }); 
  }, [addEvent]);

  const resetSimulation = useCallback(() => {
    pauseSimulation(); 
    setNodes(initialNodes); 
    setUsers(getInitialUsers()); 
    setMetricsHistory([]);
    setEventLog([]); 
    addEvent({ 
      timestamp: new Date().toLocaleTimeString(), 
      message: 'Simulation reset to initial state.', 
      type: 'info' 
    });
  }, [addEvent, pauseSimulation]);

  const addUser = useCallback((user: Omit<NetworkUser, 'id'>) => {
    // Create a new user with a unique ID and default values if needed
    const newUser: NetworkUser = { 
      ...user, 
      id: `user-${Date.now()}`,
      trafficType: user.trafficType || 'Generic',
      sendingRate: user.sendingRate > 0 ? user.sendingRate : 10,
      name: user.name || `User ${String.fromCharCode(65 + users.length)}`
    };
    
    // Update the users state
    setUsers(prev => {
      // Check if user with this name already exists to prevent duplicates
      const userExists = prev.some(u => u.name === newUser.name);
      if (userExists) {
        addEvent({
          timestamp: new Date().toLocaleTimeString(),
          message: `User with name '${newUser.name}' already exists.`,
          type: 'warning'
        });
        return prev;
      }
      
      // Add the new user and update the state
      const updatedUsers = [...prev, newUser];
      
      // Log the addition
      addEvent({ 
        timestamp: new Date().toLocaleTimeString(), 
        message: `User '${newUser.name}' added.`,
        type: 'info' 
      });
      
      return updatedUsers;
    });
  }, [addEvent, users.length]);

  const removeUser = useCallback((userId: string) => {
    setUsers(prev => {
      const userToRemove = prev.find(u => u.id === userId);
      if (userToRemove) {
        addEvent({ 
          timestamp: new Date().toLocaleTimeString(), 
          message: `User '${userToRemove.name}' removed.`,
          type: 'info' 
        });
        return prev.filter(u => u.id !== userId);
      }
      return prev;
    });
  }, [addEvent]);
  
  useEffect(() => {
    if (isRunning) {
      // Clear any existing interval to prevent multiple intervals
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }

      // Set up the simulation interval
      simulationInterval.current = setInterval(() => {
        setNodes(currentNodes => {
          const { newNodes, newMetrics, newEvent } = runSimulationStep(
            currentNodes, 
            users
          );
          
          // Update metrics history with the new metrics
          setMetricsHistory(prev => {
            const newHistory = [...prev, newMetrics];
            // Keep only the last 30 data points
            return newHistory.slice(-30);
          });
          
          // Add event if there is one
          if (newEvent) {
            addEvent(newEvent);
          }
          
          return newNodes;
        });
      }, 1000);
    }
    
    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }
    };
  }, [isRunning, users, activeAlgorithm, addEvent]);

  const value = { 
    isRunning, 
    nodes, 
    users, 
    metricsHistory, 
    eventLog, 
    activeAlgorithm, 
    startSimulation, 
    pauseSimulation, 
    resetSimulation, 
    addUser, 
    removeUser, 
    setAlgorithm 
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
