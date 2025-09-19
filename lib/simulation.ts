import { NetworkNode, NetworkUser, CongestionAlgorithm, EventLog } from '@/types';

export const runSimulationStep = (nodes: NetworkNode[], users: NetworkUser[], algorithm: CongestionAlgorithm) => {
  const totalDemand = users.reduce((sum, user) => sum + user.sendingRate, 0);
  const networkCapacity = 100; // Mock total capacity in Mbps

  let congestionFactor = Math.min(1, totalDemand / networkCapacity);
  
  if (algorithm === 'RED' && congestionFactor > 0.6) {
      congestionFactor *= 1.1;
  } else if (algorithm === 'AI-Optimized' && congestionFactor > 0.5) {
      congestionFactor *= 0.9;
  }

  const newNodes = nodes.map(node => ({
    ...node,
    congestionLevel: node.type === 'router' ? Math.min(1, congestionFactor * 1.2) : congestionFactor,
  }));

  const packetLoss = Math.max(0, (congestionFactor - 0.7) * 20);
  const throughput = Math.min(totalDemand, networkCapacity) * (1 - packetLoss / 100);
  const latency = 20 + congestionFactor * 100;

  let newEvent: EventLog | null = null;
  if(packetLoss >= 10) {
    newEvent = { timestamp: new Date().toLocaleTimeString(), message: `CRITICAL: Congestion collapse imminent. Packet loss at ${packetLoss.toFixed(1)}%.` , type: 'warning' };
  } else if (packetLoss > 5) {
    newEvent = { timestamp: new Date().toLocaleTimeString(), message: `High network latency detected. Packet loss at ${packetLoss.toFixed(1)}%.` , type: 'warning' };
  }

  return { newNodes, newMetrics: { throughput, packetLoss, latency, timestamp: Date.now() }, newEvent };
};
