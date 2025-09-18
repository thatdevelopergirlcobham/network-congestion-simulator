'use client';
import { useSimulation } from '@/context/SimulationContext';
import { Server, Users, Router } from 'lucide-react';

export default function NetworkTopology() {
  const { nodes } = useSimulation();
  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'user': return <Users className="h-6 w-6 text-blue-400" />;
      case 'router': return <Router className="h-6 w-6 text-purple-400" />;
      case 'server': return <Server className="h-6 w-6 text-green-400" />;
      default: return null;
    }
  };
  const getCongestionColor = (level: number) => {
    if (level > 0.8) return 'bg-red-500';
    if (level > 0.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  return (
    <div className="bg-card border border-border rounded-lg p-6 h-80 flex flex-col">
      <h2 className="text-lg font-medium text-foreground mb-4">Network Topology</h2>
      <div className="flex-1 overflow-auto space-y-4 pr-1">
        <div className="grid grid-cols-2 gap-4 py-2">
          {nodes.map(node => (
            <div key={node.id} className="flex items-center gap-3 py-1">
              <div className="p-2 rounded-md bg-muted/50">{getNodeIcon(node.type)}</div>
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground capitalize">{node.type} {node.id.split('-')[1]}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                  <div className={`h-full ${getCongestionColor(node.congestionLevel)}`} style={{ width: `${node.congestionLevel * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
