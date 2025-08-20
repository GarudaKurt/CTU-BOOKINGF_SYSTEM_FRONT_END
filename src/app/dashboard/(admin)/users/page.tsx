"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { addYears, format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { usersDetails } from "@/api/api";

// 1. Define schema
const formSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  address: z.string().min(1),
  birthdate: z.string().min(1),
  contact: z.string().min(11),
  rfid: z.string().min(1),
  rfidCreated: z.string().min(1),
  rfidExpiry: z.string().min(1),
  balance: z.string().min(3),
  paymentMethod: z.string().min(1),
});

// 2. Component
const CreateUsers = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "Customers",
      address: "",
      birthdate: "",
      contact: "",
      rfid: "",
      rfidCreated: new Date().toISOString().split("T")[0],
      rfidExpiry: "",
      balance: "1000",
      paymentMethod: "",
    },
  });

  const onSubmit = async (values: any) => {
    const success = await usersDetails(
      values.name,
      values.role,
      values.birthdate,
      values.address,
      values.contact,
      values.rfid,
      values.rfidCreated,
      values.rfidExpiry,
      values.balance,
      values.paymentMethod
    );

    if (success) {
      alert("User details saved successfully!");
      form.reset();
    } else {
      alert("Failed to save user details.");
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "rfidCreated" && value.rfidCreated) {
        const expiryDate = addYears(new Date(value.rfidCreated), 2);
        const formattedExpiry = format(expiryDate, "yyyy-MM-dd");
        form.setValue("rfidExpiry", formattedExpiry);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="bg-white p-6 flex items-center ml-24">
      <Card className="p-6">
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Create Clients</h2>
                <Pencil size={18} className="text-blue-500" />
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Client Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Customer" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Customer Address" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthdate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birthdate</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Cellphone #" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rfid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFID Number</FormLabel>
                          <FormControl>
                            <Input placeholder="XXXX-XXXX-XXXX" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rfidCreated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFID Created</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rfidExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFID Expiry</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="balance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFID Balance</FormLabel>
                          <FormControl>
                            <Input placeholder="1000" {...field} readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Card">Card</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="mt-4">
                    Submit
                  </Button>
                </form>
              </Form>
            </div>

            {/* RIGHT: Profile Card */}
            <div className="flex justify-center items-start">
              <div className="flex flex-col items-center">
                <Avatar>
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mt-2">Your Name</h3>
                <p className="text-sm text-gray-500">Admin</p>
                <div className="flex gap-2 mt-2">
                  <Button size="icon" variant="outline">
                    <Mail />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Phone />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUsers;
