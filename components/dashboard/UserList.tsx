'use client';
import { useSimulation } from '@/context/SimulationContext';
import { UserPlus, Trash2, Wifi, Download, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

type TrafficType = 'Video Stream' | 'File Download' | 'VoIP Call';

const trafficTypeIcons = {
  'Video Stream': Wifi,
  'File Download': Download, 
  'VoIP Call': Phone,
} as const;

const getTrafficColor = (type: TrafficType) => {
  switch (type) {
    case 'Video Stream': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'File Download': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'VoIP Call': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

export default function UserList() {
  const { users, addUser, removeUser } = useSimulation();
  const [isClient, setIsClient] = useState(false);
  const trafficTypes = ['Video Stream', 'File Download', 'VoIP Call'] as const;
  
  // Set isClient to true after mount to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getRandomType = (): TrafficType => 
    trafficTypes[Math.floor(Math.random() * trafficTypes.length)] as TrafficType;
  
  const getRateForType = (type: TrafficType): number => {
    switch(type) {
      case 'Video Stream': return Math.floor(Math.random() * 15) + 10;
      case 'File Download': return Math.floor(Math.random() * 25) + 20;
      case 'VoIP Call': return Math.floor(Math.random() * 5) + 2;
    }
  };

  const handleAddUser = () => {
    const type = getRandomType();
    addUser({
      name: `User ${String.fromCharCode(65 + users.length)}`,
      trafficType: type,
      sendingRate: getRateForType(type)
    });
  };

  const handleRemoveUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to remove ${userName}?`)) {
      removeUser(userId);
    }
  };

  // Don't render on server to avoid hydration issues
  if (!isClient) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-muted rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-foreground">
            Active Users
          </h2>
          <Badge variant="outline" className="ml-2">
            {users.length}
          </Badge>
        </div>
        <Button 
          onClick={handleAddUser} 
          size="sm" 
          variant="outline"
          className="gap-1"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Wifi className="w-8 h-8 mb-2 opacity-50 text-muted-foreground" />
            <div className="font-medium text-foreground">No active users</div>
            <div className="text-sm text-muted-foreground mt-1">Click Add User to start the simulation</div>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map(user => {
              const TrafficIcon = trafficTypeIcons[user.trafficType as TrafficType] || Wifi;
              return (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getTrafficColor(user.trafficType as TrafficType)}`}>
                      <TrafficIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">
                        {user.name}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{user.trafficType}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {user.sendingRate} Mbps
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveUser(user.id, user.name)}
                    title={`Remove ${user.name}`}
                    aria-label={`Remove ${user.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
