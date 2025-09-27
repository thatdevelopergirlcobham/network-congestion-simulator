'use client';
import { useSimulation } from '@/context/SimulationContext';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function EventLog() {
  const { eventLog } = useSimulation();
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="h-4 w-4 text-blue-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return null;
    }
  };
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-[calc(50%-0.75rem)]">
      <h2 className="text-lg font-medium text-foreground mb-3">Event Log</h2>
      <div className="flex-1 overflow-auto space-y-2 pr-1">
        {eventLog.length === 0 && <div className="text-sm text-muted-foreground italic">No events yet. Start the simulation to see activity.</div>}
        {eventLog.map((event, idx) => (
          <div key={idx} className="flex items-start gap-2 py-1 border-b border-border/30 last:border-0">
            <div className="mt-0.5">{getEventIcon(event.type)}</div>
            <div>
              <div className="text-xs text-muted-foreground">{event.timestamp}</div>
              <div className="text-sm text-foreground">{event.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
