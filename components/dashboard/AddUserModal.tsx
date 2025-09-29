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

import { NetworkUser } from "@/types";

const TRAFFIC_TYPES = [
  { value: "Video Stream", label: "Video Stream" },
  { value: "File Download", label: "File Download" },
  { value: "VoIP Call", label: "VoIP Call" },
] as const;

export default function AddUserModal({ onAddUser }: { onAddUser: () => void }) {
  const [name, setName] = useState("");
  const [trafficType, setTrafficType] = useState("");
  const [sendingRate, setSendingRate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: Omit<NetworkUser, 'id'> = {
      name,
      trafficType: trafficType as NetworkUser['trafficType'],
      sendingRate: parseFloat(sendingRate) || 0,
    };

    // Get existing users from localStorage
    const existingUsers = localStorage.getItem('networkUsers');
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    
    // Add new user
    const updatedUsers = [...users, newUser];
    
    // Save to localStorage
    localStorage.setItem('networkUsers', JSON.stringify(updatedUsers));
    
    // Reset form
    setName('');
    setTrafficType('');
    setSendingRate('');
    
    // Close dialog and notify parent
    setIsOpen(false);
    onAddUser();
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
              <Select value={trafficType} onValueChange={setTrafficType}>
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
                min="0"
                step="0.1"
                value={sendingRate}
                onChange={(e) => setSendingRate(e.target.value)}
                className="col-span-3"
                required
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
