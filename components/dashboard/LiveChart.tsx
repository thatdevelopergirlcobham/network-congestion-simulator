'use client';
import { useSimulation } from '@/context/SimulationContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LiveChart() {
  const { metricsHistory } = useSimulation();
  return (
    <div className="bg-card border border-border rounded-lg p-6 h-80 flex flex-col">
      <h2 className="text-lg font-medium text-foreground mb-4">Network Metrics</h2>
      <div className="flex-1 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metricsHistory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="timestamp" stroke="#888" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '4px' }} labelStyle={{ color: '#fff' }} formatter={(value) => value.toFixed(1)} labelFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="throughput" stroke="#22c55e" name="Throughput (Mbps)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="latency" stroke="#eab308" name="Latency (ms)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="packetLoss" stroke="#ef4444" name="Packet Loss (%)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
