'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSimulation } from '@/context/SimulationContext';
import { useEffect, useState } from 'react';

export default function LiveChart() {
  const { metricsHistory, isRunning } = useSimulation();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after mount to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Format the timestamp for display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Format tooltip values
  const formatTooltip = (value: number, name: string) => {
    if (typeof value !== 'number') return ['N/A', name];
    
    switch (name) {
      case 'throughput':
        return [`${value.toFixed(2)} Mbps`, 'Throughput'];
      case 'latency':
        return [`${value.toFixed(2)} ms`, 'Latency'];
      case 'packetLoss':
        return [`${value.toFixed(2)}%`, 'Packet Loss'];
      default:
        return [value.toString(), name];
    }
  };

  // Don't render the chart on the server to avoid hydration issues
  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-time Network Metrics</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Loading network metrics...
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[364px] flex items-center justify-center">
          <div className="text-muted-foreground">Initializing chart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Network Metrics</CardTitle>
        <div className="text-sm text-muted-foreground">
          {isRunning ? 'Live data of network performance' : 'Start the simulation to see live data'}
        </div>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {!metricsHistory || metricsHistory.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {isRunning ? 'Collecting data...' : 'Start the simulation to see metrics'}
          </div>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={metricsHistory}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPacketLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={formatTime}
                />
                <Area
                  type="monotone"
                  dataKey="throughput"
                  name="Throughput"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorThroughput)"
                  unit=" Mbps"
                  isAnimationActive={true}
                  animationDuration={500}
                />
                <Area
                  type="monotone"
                  dataKey="latency"
                  name="Latency"
                  stroke="#eab308"
                  fillOpacity={1}
                  fill="url(#colorLatency)"
                  unit=" ms"
                  isAnimationActive={true}
                  animationDuration={500}
                />
                <Area
                  type="monotone"
                  dataKey="packetLoss"
                  name="Packet Loss"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorPacketLoss)"
                  unit="%"
                  isAnimationActive={true}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
