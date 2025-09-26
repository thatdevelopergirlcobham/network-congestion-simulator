import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NetworkUser } from "@/types";

interface UserTableProps {
  users: NetworkUser[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Traffic Type</TableHead>
          <TableHead>Sending Rate (Mbps)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.trafficType}</TableCell>
            <TableCell>{user.sendingRate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
