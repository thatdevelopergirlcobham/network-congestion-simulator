'use client';
import { useSimulation } from '@/context/SimulationContext';
import { Play, Pause, RefreshCw, Settings2 } from 'lucide-react';
import { CongestionAlgorithm } from '@/types';

export default function SimulationControls() {
  const { isRunning, activeAlgorithm, startSimulation, pauseSimulation, resetSimulation, setAlgorithm } = useSimulation();
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button onClick={startSimulation} className="px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-md flex items-center gap-2 transition-colors">
            <Play className="h-4 w-4" /><span>Start</span>
          </button>
        ) : (
          <button onClick={pauseSimulation} className="px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded-md flex items-center gap-2 transition-colors">
            <Pause className="h-4 w-4" /><span>Pause</span>
          </button>
        )}
        <button onClick={resetSimulation} className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-md flex items-center gap-2 transition-colors">
          <RefreshCw className="h-4 w-4" /><span>Reset</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <label htmlFor="algorithm-select" className="text-sm font-medium text-muted-foreground">Control Algorithm:</label>
        <select id="algorithm-select" value={activeAlgorithm} onChange={(e) => setAlgorithm(e.target.value as CongestionAlgorithm)} className="bg-input border border-border text-foreground text-sm rounded-md focus:ring-primary focus:border-primary px-3 py-2">
          <option>TCP Reno</option><option>RED</option><option>AI-Optimized</option>
        </select>
      </div>
    </div>
  );
}
