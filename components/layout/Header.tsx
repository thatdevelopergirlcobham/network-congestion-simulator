import { Network } from 'lucide-react';
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Network Congestion Simulator</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
