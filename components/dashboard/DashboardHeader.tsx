import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  onSimulationToggle: () => void;
  isSimulationRunning: boolean;
};

export default function DashboardHeader({ 
  onSimulationToggle, 
  isSimulationRunning 
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <Button
          variant={isSimulationRunning ? "destructive" : "default"}
          onClick={onSimulationToggle}
          className="gap-2"
        >
          {isSimulationRunning ? (
            <>
              <Square className="h-4 w-4" />
              Stop Simulation
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Simulation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
