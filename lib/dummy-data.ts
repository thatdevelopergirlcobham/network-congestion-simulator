import { NetworkUser } from "@/types";

export const dummyUsers: NetworkUser[] = [
  {
    id: "1",
    name: "Alice",
    trafficType: "Video Stream",
    sendingRate: 5,
  },
  {
    id: "2",
    name: "Bob",
    trafficType: "File Download",
    sendingRate: 10,
  },
  {
    id: "3",
    name: "Charlie",
    trafficType: "VoIP Call",
    sendingRate: 0.5,
  },
];
