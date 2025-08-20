"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
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

import { createSchedules, getSchedules, bookings } from "@/api/api";

type ScheduleProps = {
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  price_economy_class: string;
  price_business_class?: string;
  onSelectClick?: (schedule: ScheduleProps) => void;
};

const ScheduleCard: React.FC<ScheduleProps> = ({
  origin,
  destination,
  departure_date,
  return_date,
  price_economy_class,
  price_business_class,
  onSelectClick,
}) => (
  <Card className="w-full md:w-50">
    <CardContent className="pt-6 text-center space-y-1">
      <p className="text-sm font-medium">
        {origin} ➜ {destination}
      </p>
      <p className="text-muted-foreground text-xs">
        {new Date(departure_date).toDateString()}
      </p>
      <p className="text-red-500 text-xs">Start From</p>
      <p className="font-semibold text-sm">₱{price_economy_class} / Pax</p>
      <Button
        size="sm"
        className="mt-2 w-full bg-red-500 hover:bg-red-600"
        onClick={() =>
          onSelectClick &&
          onSelectClick({
            origin,
            destination,
            departure_date,
            return_date,
            price_economy_class,
            price_business_class,
          })
        }
      >
        Select
      </Button>
    </CardContent>
  </Card>
);

const Schedules: React.FC = () => {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [priceEconomy, setPriceEconomy] = useState<string>("");
  const [priceBusiness, setPriceBusiness] = useState<string>("");
  const [payment, setPayment] = useState<number>(0);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filterOrigin, setFilterOrigin] = useState("");
  const [filterDestination, setFilterDestination] = useState("");

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleProps | null>(null);

  const [rfid, setRfid] = useState<string>("");
  const [tripType, setTripType] = useState<string>("");
  const [seatClass, setSeatClass] = useState<string>("");
  const [passengers, setPassengers] = useState<string>("");

  useEffect(() => {
    if (!selectedSchedule || !seatClass || !passengers) {
      setPayment(0);
      return;
    }

    const price =
      seatClass === "Economy"
        ? Number(selectedSchedule.price_economy_class)
        : Number(selectedSchedule.price_business_class || 0); // add this field if not already in your data

    const total = price * Number(passengers || 0);
    setPayment(total);
  }, [seatClass, passengers, selectedSchedule]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await getSchedules();
      if (data) setSchedules(data);
      setLoading(false);
    };

    fetchSchedules();
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    return (
      schedule.origin.toLowerCase().includes(filterOrigin.toLowerCase()) &&
      schedule.destination
        .toLowerCase()
        .includes(filterDestination.toLowerCase())
    );
  });

  const handleSaveSchedule = async () => {
    if (!origin || !destination || !departureDate || !returnDate) {
      alert("Please fill in all fields.");
      return;
    }

    const success = await createSchedules(
      origin,
      destination,
      departureDate.toISOString().split("T")[0],
      returnDate.toISOString().split("T")[0],
      priceEconomy,
      priceBusiness
    );

    if (success) {
      alert("Schedule created successfully!");
      setIsSheetOpen(false);
      setOrigin("");
      setDestination("");
      setDepartureDate(undefined);
      setReturnDate(undefined);
      setPriceEconomy("");
      setPriceBusiness("");

      // Refresh schedules
      const data = await getSchedules();
      if (data) setSchedules(data);
    } else {
      alert("Failed to create schedule.");
    }
  };

  const handleSelectClick = (schedule: ScheduleProps) => {
    setSelectedSchedule(schedule);
    setIsSelectModalOpen(true);

    setRfid("");
    setTripType("");
    setSeatClass("");
    setPassengers("");
  };

  const handleSubmit = async () => {
    if (!rfid || !tripType || !seatClass || !passengers || !selectedSchedule) {
      alert("Please fill in all fields.");
      return;
    }

    const passengerCount = Number(passengers);
    if (passengerCount <= 0) {
      alert("Passengers must be greater than 0.");
      return;
    }

    const returnDateStr =
      tripType === "Round Trip"
        ? selectedSchedule.return_date
        : selectedSchedule.departure_date;

    const success = await bookings(
      rfid,
      selectedSchedule.origin,
      selectedSchedule.destination,
      selectedSchedule.departure_date,
      returnDateStr,
      tripType,
      seatClass,
      passengerCount,
      payment
    );

    if (success) {
      alert("Booking successful!");
      setIsSelectModalOpen(false);

      setRfid("");
      setTripType("");
      setSeatClass("");
      setPassengers("");
      setPayment(0);
    } else {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <>
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
              {/* Filter Inputs */}
              <Input
                placeholder="Origin"
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
              />
              <Input
                placeholder="Destination"
                value={filterDestination}
                onChange={(e) => setFilterDestination(e.target.value)}
              />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            <p>Loading schedules...</p>
          ) : filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule, index) => (
              <ScheduleCard
                key={index}
                origin={schedule.origin}
                destination={schedule.destination}
                departure_date={schedule.departure_date}
                return_date={schedule.return_date}
                price_economy_class={schedule.price_economy_class}
                price_business_class={schedule.price_business_class}
                onSelectClick={handleSelectClick}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-full">
              No schedules available.
            </p>
          )}
        </div>
      </div>

      {/* New Schedule Form */}
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
              <Input
                id="origin"
                placeholder="e.g., Cebu"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Bantayan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
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
              <Label htmlFor="economy">Economy</Label>
              <Input
                id="economy"
                placeholder="1000"
                value={priceEconomy}
                onChange={(e) => setPriceEconomy(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business">Business</Label>
              <Input
                id="business"
                placeholder="1500"
                value={priceBusiness}
                onChange={(e) => setPriceBusiness(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter className="mt-4">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSaveSchedule}
            >
              Save Schedule
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Modal for Select button */}
      <Sheet open={isSelectModalOpen} onOpenChange={setIsSelectModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedSchedule
                ? `${selectedSchedule.origin} ➜ ${
                    selectedSchedule.destination
                  } (${new Date(
                    selectedSchedule.departure_date
                  ).toDateString()})`
                : "Select Schedule"}
            </SheetTitle>
            <SheetDescription>
              Fill in the details below to confirm your selection.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rfid">RFID Card</Label>
              <Input
                id="rfid"
                placeholder="Enter RFID card number"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tripType">Your Trip</Label>
              <Select
                onValueChange={(value) => setTripType(value)}
                value={tripType}
              >
                <SelectTrigger id="tripType" className="w-full">
                  <SelectValue placeholder="Select Your Trip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Trip</SelectLabel>
                    <SelectItem value="Round Trip">Round Trip</SelectItem>
                    <SelectItem value="One Way">One Way</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="seatClass">Seat Class</Label>
              <Select
                onValueChange={(value) => setSeatClass(value)}
                value={seatClass}
              >
                <SelectTrigger id="seatClass" className="w-full">
                  <SelectValue placeholder="Select Seat Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Seat Class</SelectLabel>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="passengers">Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min={1}
                placeholder="Number of passengers"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                onBlur={() =>
                  setPassengers((prev) => String(Number(prev) || 0))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment">Settled Payment</Label>
              <Input
                id="payment"
                type="number"
                placeholder="₱0"
                value={payment}
                readOnly
              />
            </div>
          </div>

          <SheetFooter>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Schedules;
