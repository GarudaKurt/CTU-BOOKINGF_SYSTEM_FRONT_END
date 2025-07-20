"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";

import Admin from "../../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

// Card for each schedule
const ScheduleCard: React.FC = () => (
  <Card className="w-full md:w-50">
    <CardContent className="pt-6 text-center space-y-1">
      <p className="text-sm font-medium">Cebu ➜ Bantayan</p>
      <p className="text-muted-foreground text-xs">Fri, Jul 7 2025</p>
      <p className="text-red-500 text-xs">Start From</p>
      <p className="font-semibold text-sm">₱1000.00 / Pax</p>
      <Button size="sm" className="mt-2 w-full bg-red-500 hover:bg-red-600">
        Select
      </Button>
    </CardContent>
  </Card>
);

const Schedules: React.FC = () => {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Admin>
      <div className="p-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Schedules</CardTitle>
          </CardHeader>
          <CardDescription>
            <div className="flex flex-wrap gap-2 px-4 py-2 items-center">
              <Select>
                <SelectTrigger className="border-none shadow-none px-0 w-[120px] text-gray-700 text-sm font-medium focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Round Trip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Trip</SelectLabel>
                    <SelectItem value="Round Trip">Round Trip</SelectItem>
                    <SelectItem value="One Way">One Way</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="border-none shadow-none px-0 w-[120px] text-gray-700 text-sm font-medium focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Economy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Seat Class</SelectLabel>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="ml-auto">
                <Button
                  size="sm"
                  className="flex items-center gap-1 bg-white-500 hover:bg-white-600 text-black"
                  onClick={() => setIsSheetOpen(true)}
                >
                  <PlusCircle className="w-4 h-4" />
                  New Schedule
                </Button>
              </div>
            </div>
          </CardDescription>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Input placeholder="Origin" />
              <Input placeholder="Destination" />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : "Departure"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : "Return"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                  />
                </PopoverContent>
              </Popover>

              <Input placeholder="Passenger" />
              <Button className="bg-blue-400 hover:bg-blue-500">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, index) => (
            <ScheduleCard key={index} />
          ))}
        </div>
      </div>

      {/* New Schedule Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Schedule</SheetTitle>
            <SheetDescription>
              Fill in the details to add a new ferry schedule.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" placeholder="e.g., Cebu" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="e.g., Bantayan" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : "Departure"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : "Return"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <br />
          <Label htmlFor="origin">Price Rate's</Label>
          <hr />
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="origin">Economy</Label>
              <Input id="origin" placeholder="1000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Business</Label>
              <Input id="destination" placeholder="1500" />
            </div>
          </div>

          <SheetFooter className="mt-4">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Schedule
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Admin>
  );
};

export default Schedules;
