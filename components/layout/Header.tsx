import { Network } from 'lucide-react';
export default function Header() {
  return (
    <header className="py-4 px-6 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="flex items-center gap-3">
        <Network className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">Network Congestion Simulator</h1>
      </div>
    </header>
  );
}
