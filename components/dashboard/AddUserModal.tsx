import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimulation } from "@/context/SimulationContext";
import { NetworkUser } from "@/types";

const TRAFFIC_TYPES = [
  { value: "Video Stream", label: "Video Stream" },
  { value: "File Download", label: "File Download" },
  { value: "VoIP Call", label: "VoIP Call" },
] as const;

const DEFAULT_RATES = {
  'Video Stream': 10,
  'File Download': 30,
  'VoIP Call': 5,
};

interface AddUserModalProps {
  onAddUser?: () => void;
}

export default function AddUserModal({ onAddUser }: AddUserModalProps) {
  const { addUser } = useSimulation();
  const [name, setName] = useState("");
  const [trafficType, setTrafficType] = useState<NetworkUser['trafficType'] | ''>('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !trafficType) return;
    
    addUser({
      name,
      trafficType: trafficType as NetworkUser['trafficType'],
      sendingRate: trafficType ? DEFAULT_RATES[trafficType] : 10,
    });
    
    // Reset form
    setName('');
    setTrafficType('');
    setIsOpen(false);
    
    // Call the onAddUser callback if provided
    if (onAddUser) {
      onAddUser();
    }
  };
  
  const handleTrafficTypeChange = (value: string) => {
    setTrafficType(value as NetworkUser['trafficType']);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details of the new user below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trafficType" className="text-right">
                Traffic Type
              </Label>
              <Select value={trafficType} onValueChange={handleTrafficTypeChange} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select traffic type" />
                </SelectTrigger>
                <SelectContent>
                  {TRAFFIC_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sendingRate" className="text-right">
                Sending Rate (Mbps)
              </Label>
              <Input
                id="sendingRate"
                type="number"
                min="1"
                max="100"
                value={trafficType ? String(DEFAULT_RATES[trafficType as keyof typeof DEFAULT_RATES]) : ''}
                readOnly
                className="col-span-3 bg-muted/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
