export type CongestionAlgorithm = 'TCP Reno' | 'RED' | 'AI-Optimized';

export interface NetworkNode {
  id: string;
  type: 'user' | 'router' | 'server';
  congestionLevel: number; // 0 (none) to 1 (max)
}

export interface NetworkUser {
  id: string;
  name: string;
  trafficType: "Video Stream" | "File Download" | "VoIP Call";
  sendingRate: number;
}

export interface NetworkMetrics {
  timestamp: number;
  throughput: number; // in Mbps
  packetLoss: number; // percentage
  latency: number; // in ms
}

export interface EventLog {
    timestamp: string;
    message: string;
    type: 'info' | 'warning' | 'success';
}
