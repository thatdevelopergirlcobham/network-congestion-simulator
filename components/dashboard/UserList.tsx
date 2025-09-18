'use client';
import { useSimulation } from '@/context/SimulationContext';
import { UserPlus, UserMinus } from 'lucide-react';

export default function UserList() {
  const { users, addUser, removeUser } = useSimulation();
  const trafficTypes = ['Video Stream', 'File Download', 'VoIP Call'] as const;
  const getRandomType = () => trafficTypes[Math.floor(Math.random() * trafficTypes.length)];
  const getRateForType = (type: typeof trafficTypes[number]) => {
    switch(type) {
      case 'Video Stream': return Math.floor(Math.random() * 15) + 10;
      case 'File Download': return Math.floor(Math.random() * 25) + 20;
      case 'VoIP Call': return Math.floor(Math.random() * 5) + 2;
    }
  };
  const handleAddUser = () => {
    const type = getRandomType();
    addUser({
      name: `User ${String.fromCharCode(65 + users.length)} (${type.split(' ')[0]})`,
      trafficType: type,
      sendingRate: getRateForType(type)
    });
  };
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-[calc(50%-0.75rem)]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-foreground">Active Users ({users.length})</h2>
        <button onClick={handleAddUser} className="p-1 hover:bg-muted/50 rounded transition-colors" title="Add new user">
          <UserPlus className="h-5 w-5 text-green-400" />
        </button>
      </div>
      <div className="flex-1 overflow-auto space-y-2 pr-1">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
            <div>
              <p className="font-medium text-sm text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.trafficType} • {user.sendingRate} Mbps</p>
            </div>
            <button onClick={() => removeUser(user.id)} className="p-1 hover:bg-muted/50 rounded transition-colors" title="Remove user">
              <UserMinus className="h-4 w-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
