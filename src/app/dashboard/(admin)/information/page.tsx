"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
import { updateUserDetails, deleteUserDetails } from "@/api/api";

const USERS_API_URL = "http://localhost:8000/api/details/";

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

const ITEMS_PER_PAGE = 7;

const UserInfo: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.Fullname.toLowerCase().includes(term) ||
      user.Status.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(USERS_API_URL, { withCredentials: true });
        const transformed = res.data.map(
          (u: any, index: number): User => ({
            id: u.userid || index,
            Fullname: u.fullname,
            Birthdate: u.birthdate,
            Address: u.address,
            Status: parseFloat(u.rfid_balance) > 0 ? "Active" : "Inactive",
            RFID: u.rfid_number,
            Exipiry: u.expiry_rfid,
            Payment: u.payment,
            Role: u.role,
          })
        );
        setUsers(transformed);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({ ...user });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    const success = await deleteUserDetails(id);
    if (success) {
      console.log("User deleted successfully");
      setUsers((prev) => prev.filter((user) => user.id !== id)); // Update UI
    } else {
      console.error("Failed to delete user");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof User
  ) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [key]: e.target.value });
  };

  const handleSave = async () => {
    if (!editForm) return;

    const payload = {
      fullname: editForm.Fullname,
      role: editForm.Role,
      birthdate: editForm.Birthdate,
      address: editForm.Address,
      rfid_number: editForm.RFID,
      expiry_rfid: editForm.Exipiry,
      payment: editForm.Payment,
    };

    const success = await updateUserDetails(editForm.id, payload);

    if (success) {
      console.log("User updated successfully");
      setIsDialogOpen(false);
      // Refresh list here if needed
    } else {
      console.error("Failed to update user");
    }
  };

  return (
    <>
      <Card className="w-full p-6 overflow-x-auto">
        <CardContent>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Information</h2>
            <Pencil size={18} className="text-blue-500" />
          </div>
          <Input
            className="flex flex-end max-w-xs mb-4"
            placeholder="Search by Fullname or Status"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />

          <br />

          <Table>
            <TableCaption>A list of customer profiles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]">ID</TableHead>
                <TableHead className="w-[200px]">Fullname</TableHead>
                <TableHead className="w-[20px]">Birthdate</TableHead>
                <TableHead className="w-[180px]">Address</TableHead>
                <TableHead className="w-[20px]">Status</TableHead>
                <TableHead className="w-[250px]">RFID</TableHead>
                <TableHead className="w-[100px]">Expiry</TableHead>
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
    </>
  );
};

export default UserInfo;
