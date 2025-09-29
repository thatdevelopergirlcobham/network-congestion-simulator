import { NetworkNode, NetworkUser, NetworkMetrics, EventLog } from '@/types';

// Track simulation trends
let trend = 0; // -1 = decreasing, 0 = stable, 1 = increasing
let trendCounter = 0;

export function runSimulationStep(
  nodes: NetworkNode[],
  users: NetworkUser[]
): { newNodes: NetworkNode[]; newMetrics: NetworkMetrics; newEvent?: EventLog } {
  // Calculate total sending rate from all users with some variation
  const baseSendingRate = users.reduce((sum, user) => {
    // Add some randomness to each user's sending rate (±10%)
    const variation = 0.8 + (Math.random() * 0.4);
    return sum + (user.sendingRate * variation);
  }, 0);
  
  // Simulate different traffic patterns based on time
  const timeFactor = 0.5 + (0.5 * Math.sin(Date.now() / 30000)); // 30 second cycle
  const adjustedSendingRate = baseSendingRate * (0.8 + (timeFactor * 0.4));
  
  // Calculate congestion based on adjusted sending rate
  const baseCongestion = Math.min(0.95, adjustedSendingRate / 150);
  
  // Add some randomness and smooth transitions
  const randomFactor = 0.1 * (Math.random() - 0.5);
  let congestionLevel = Math.max(0.05, Math.min(0.95, baseCongestion * (1 + randomFactor)));
  
  // Add some trending behavior
  if (trendCounter <= 0) {
    // Change trend every 5-15 seconds
    trend = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    trendCounter = 5 + Math.floor(Math.random() * 10);
  } else {
    trendCounter--;
  }
  
  // Apply trend
  congestionLevel = Math.max(0.05, Math.min(0.95, congestionLevel + (trend * 0.02)));
  
  // Update nodes with new congestion levels
  const newNodes = nodes.map(node => {
    // Different node types have different base congestion levels
    let nodeCongestion = congestionLevel;
    if (node.type === 'router') {
      nodeCongestion *= 1.2; // Routers are more likely to be congested
    } else if (node.type === 'server') {
      nodeCongestion *= 0.8; // Servers handle load better
    }
    
    return {
      ...node,
      congestionLevel: Math.min(0.95, Math.max(0.05, nodeCongestion))
    };
  });
  
  // Calculate metrics with some realistic relationships
  const latency = 20 + (congestionLevel * 180) + (Math.random() * 20); // 20-200ms
  const packetLoss = Math.min(0.3, Math.pow(congestionLevel, 2) * 0.5); // 0-30%
  const throughput = Math.round((1 - Math.pow(congestionLevel, 1.5)) * 100); // 0-100%
  
  // Create metrics for this step
  const newMetrics: NetworkMetrics = {
    timestamp: Date.now(),
    latency: Math.round(latency * 10) / 10,
    packetLoss: Math.round(packetLoss * 100) / 100,
    throughput: Math.max(5, throughput) // Ensure minimum 5% throughput
  };
  
  // Generate events for significant changes
  let newEvent: EventLog | undefined;
  const eventChance = 0.15; // 15% chance of an event each second
  
  if (Math.random() < eventChance) {
    let message = '';
    let type: EventLog['type'] = 'info';
    
    if (congestionLevel > 0.8) {
      type = 'warning';
      const actions = ['High congestion detected', 'Network experiencing heavy load', 'Performance degradation'];
      message = actions[Math.floor(Math.random() * actions.length)];
    } else if (congestionLevel > 0.6) {
      type = 'info';
      const actions = ['Moderate network load', 'Network traffic increasing', 'Monitoring performance'];
      message = actions[Math.floor(Math.random() * actions.length)];
    } else {
      type = 'success';
      const actions = ['Network operating normally', 'Optimal performance', 'All systems nominal'];
      message = actions[Math.floor(Math.random() * actions.length)];
    }
    
    // Add user-specific events occasionally
    if (users.length > 0 && Math.random() < 0.3) {
      const user = users[Math.floor(Math.random() * users.length)];
      const actions = [
        `${user.name} ${user.trafficType === 'Video Stream' ? 'streaming video' : 
          user.trafficType === 'VoIP Call' ? 'on a call' : 'downloading files'}`,
        `Adjusted bandwidth for ${user.name}`,
        `${user.name}'s session quality ${Math.random() > 0.5 ? 'improved' : 'degraded'}`
      ];
      message = actions[Math.floor(Math.random() * actions.length)];
    }
    
    newEvent = {
      timestamp: new Date().toLocaleTimeString(),
      message: message,
      type: type
    };
  }
  
  return { newNodes, newMetrics, newEvent };
}
