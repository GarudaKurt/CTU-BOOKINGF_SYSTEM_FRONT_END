"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import Admin from "../../page";

type User = {
  id: number;
  Fullname: string;
  Birthdate: string;
  Address: string;
  Status: string;
  RFID: string;
  Exipiry: string;
  Payment: string;
  Role: string;
};

const userDetails: User[] = [
  {
    id: 1,
    Fullname: "Aldren L. Letada",
    Birthdate: "04/29/1998",
    Address: "Cebu City",
    Status: "Active",
    RFID: "187423948",
    Exipiry: "12/12/2026",
    Payment: "Cash",
    Role: "Customer",
  },
  {
    id: 2,
    Fullname: "Maria Clara",
    Birthdate: "11/02/1993",
    Address: "Lapu-Lapu",
    Status: "Active",
    RFID: "1111222233",
    Exipiry: "09/09/2026",
    Payment: "Card",
    Role: "Customer",
  },
  {
    id: 3,
    Fullname: "Jose Rizal",
    Birthdate: "06/19/1861",
    Address: "Calamba",
    Status: "Inactive",
    RFID: "3333444455",
    Exipiry: "05/05/2025",
    Payment: "Cash",
    Role: "Staff",
  },
  {
    id: 4,
    Fullname: "Juan Dela Cruz",
    Birthdate: "05/12/1995",
    Address: "Mandaue",
    Status: "Inactive",
    RFID: "193847564",
    Exipiry: "01/01/2025",
    Payment: "Gcash",
    Role: "Admin",
  },
  {
    id: 5,
    Fullname: "Andres Bonifacio",
    Birthdate: "11/30/1863",
    Address: "Tondo",
    Status: "Active",
    RFID: "5566778899",
    Exipiry: "12/12/2026",
    Payment: "Cash",
    Role: "Staff",
  },
  {
    id: 6,
    Fullname: "Emilio Aguinaldo",
    Birthdate: "03/22/1869",
    Address: "Cavite",
    Status: "Inactive",
    RFID: "9988776655",
    Exipiry: "10/10/2027",
    Payment: "Gcash",
    Role: "Customer",
  },
  {
    id: 7,
    Fullname: "Gregorio Del Pilar",
    Birthdate: "11/14/1875",
    Address: "Bulacan",
    Status: "Active",
    RFID: "4455667788",
    Exipiry: "11/11/2027",
    Payment: "Card",
    Role: "Customer",
  },
  {
    id: 8,
    Fullname: "Melchora Aquino",
    Birthdate: "01/06/1812",
    Address: "Caloocan",
    Status: "Active",
    RFID: "7777888899",
    Exipiry: "01/01/2028",
    Payment: "Cash",
    Role: "Support",
  },
];

const ITEMS_PER_PAGE = 7;

const UserInfo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);

  const totalPages = Math.ceil(userDetails.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = userDetails.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({ ...user }); // clone to separate edit state
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof User
  ) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [key]: e.target.value });
  };

  const handleSave = () => {
    console.log("Save user:", editForm);
    setIsDialogOpen(false);
    // Apply the save to backend or state here
  };

  return (
    <Admin>
      <Card className="p-6">
        <CardContent>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Information</h2>
            <Pencil size={18} className="text-blue-500" />
          </div>
          <Input className="flex flex-end max-w-xs" placeholder="Search" />
          <br />

          <Table>
            <TableCaption>A list of customer profiles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]">ID</TableHead>
                <TableHead className="w-[20px]">Fullname</TableHead>
                <TableHead className="w-[20px]">Birthdate</TableHead>
                <TableHead className="w-[20px]">Address</TableHead>
                <TableHead className="w-[20px]">Status</TableHead>
                <TableHead className="w-[20px]">RFID</TableHead>
                <TableHead className="w-[20px]">Expiry</TableHead>
                <TableHead className="w-[20px]">Payment</TableHead>
                <TableHead className="w-[20px]">Role</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((data: User) => (
                <TableRow key={data.id}>
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{data.Fullname}</TableCell>
                  <TableCell>{data.Birthdate}</TableCell>
                  <TableCell>{data.Address}</TableCell>
                  <TableCell>{data.Status}</TableCell>
                  <TableCell>{data.RFID}</TableCell>
                  <TableCell>{data.Exipiry}</TableCell>
                  <TableCell>{data.Payment}</TableCell>
                  <TableCell>{data.Role}</TableCell>
                  <TableCell className="flex gap-2">
                    <Pencil
                      size={18}
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEdit(data)}
                    />
                    <Trash
                      size={18}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(data.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrevious}
                    className="cursor-pointer"
                  />
                </PaginationItem>
                <PaginationItem className="px-3 py-1 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNext}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              Editing user: <strong>{selectedUser?.Fullname}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="fullname">Fullname</Label>
                <Input
                  id="fullname"
                  value={editForm?.Fullname || ""}
                  onChange={(e) => handleInputChange(e, "Fullname")}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input
                  id="birthdate"
                  value={editForm?.Birthdate || ""}
                  onChange={(e) => handleInputChange(e, "Birthdate")}
                />
              </div>
            </div>

            {/* Row 2: Address + Status */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editForm?.Address || ""}
                  onChange={(e) => handleInputChange(e, "Address")}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={editForm?.Status || ""}
                  onChange={(e) => handleInputChange(e, "Status")}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="rfid">RFID</Label>
                <Input
                  id="rfid"
                  value={editForm?.RFID || ""}
                  onChange={(e) => handleInputChange(e, "RFID")}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  value={editForm?.Exipiry || ""}
                  onChange={(e) => handleInputChange(e, "Exipiry")}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="payment">Payment</Label>
                <Input
                  id="payment"
                  value={editForm?.Payment || ""}
                  onChange={(e) => handleInputChange(e, "Payment")}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={editForm?.Role || ""}
                  onChange={(e) => handleInputChange(e, "Role")}
                />
              </div>
            </div>

            <div className="flex justify-start pt-4">
              <Button onClick={handleSave} className="bg-blue-500 text-white">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Admin>
  );
};

export default UserInfo;
