'use client';
import { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { NetworkNode, NetworkUser, NetworkMetrics, CongestionAlgorithm, EventLog } from '@/types';
import { runSimulationStep } from '@/lib/simulation';

const initialNodes: NetworkNode[] = [
  { id: 'user-a', type: 'user', congestionLevel: 0 }, { id: 'router-1', type: 'router', congestionLevel: 0 },
  { id: 'router-2', type: 'router', congestionLevel: 0 }, { id: 'server-x', type: 'server', congestionLevel: 0 },
];
const initialUsers: NetworkUser[] = [
  { id: 'user-1', name: 'User A (Video)', trafficType: 'Video Stream', sendingRate: 25 },
  { id: 'user-2', name: 'User B (Download)', trafficType: 'File Download', sendingRate: 30 },
];

interface SimulationContextType {
  isRunning: boolean; nodes: NetworkNode[]; users: NetworkUser[]; metricsHistory: NetworkMetrics[];
  eventLog: EventLog[]; activeAlgorithm: CongestionAlgorithm; startSimulation: () => void;
  pauseSimulation: () => void; resetSimulation: () => void; addUser: (user: Omit<NetworkUser, 'id'>) => void;
  removeUser: (userId: string) => void; setAlgorithm: (algorithm: CongestionAlgorithm) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [users, setUsers] = useState<NetworkUser[]>(initialUsers);
  const [metricsHistory, setMetricsHistory] = useState<NetworkMetrics[]>([]);
  const [eventLog, setEventLog] = useState<EventLog[]>([]);
  const [activeAlgorithm, setAlgorithm] = useState<CongestionAlgorithm>('TCP Reno');
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  const addEvent = (log: EventLog) => setEventLog(prev => [log, ...prev.slice(0, 49)]);
  const startSimulation = () => { setIsRunning(true); addEvent({ timestamp: new Date().toLocaleTimeString(), message: 'Simulation started.', type: 'success' }); };
  const pauseSimulation = () => { setIsRunning(false); addEvent({ timestamp: new Date().toLocaleTimeString(), message: 'Simulation paused.', type: 'info' }); };
  const resetSimulation = () => {
    pauseSimulation(); setNodes(initialNodes); setUsers(initialUsers); setMetricsHistory([]);
    setEventLog([]); addEvent({ timestamp: new Date().toLocaleTimeString(), message: 'Simulation reset to initial state.', type: 'info' });
  };
  const addUser = (user: Omit<NetworkUser, 'id'>) => {
    const newUser: NetworkUser = { ...user, id: `user-${Date.now()}`  };
    setUsers(prev => [...prev, newUser]);
    addEvent({ timestamp: new Date().toLocaleTimeString(), message: `User '${newUser.name}' added.` , type: 'info' });
  };
  const removeUser = (userId: string) => {
    const userToRemove = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (userToRemove) addEvent({ timestamp: new Date().toLocaleTimeString(), message: `User '${userToRemove.name}' removed.` , type: 'info' });
  };
  
  useEffect(() => {
    if (isRunning) {
      simulationInterval.current = setInterval(() => {
        const { newNodes, newMetrics, newEvent } = runSimulationStep(nodes, users, activeAlgorithm);
        setNodes(newNodes);
        setMetricsHistory(prev => [...prev.slice(-29), newMetrics]);
        if(newEvent) addEvent(newEvent);
      }, 1000);
    } else if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    return () => { if (simulationInterval.current) clearInterval(simulationInterval.current); };
  }, [isRunning, nodes, users, activeAlgorithm]);

  const value = { isRunning, nodes, users, metricsHistory, eventLog, activeAlgorithm, startSimulation, pauseSimulation, resetSimulation, addUser, removeUser, setAlgorithm };
  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
