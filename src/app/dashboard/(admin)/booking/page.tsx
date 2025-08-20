"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { getAllBookings } from "@/api/api";

type Booking = {
  booking_id: number;
  rfid: string;
  origin: string;
  destination: string;
  departure: string;
  return_date: string;
  trip: string;
  seat_class: string;
  passenger: number;
  settled: number;
};

const ITEMS_PER_PAGE = 7;

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getAllBookings();
      if (data && Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings");
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const term = searchTerm.toLowerCase();
    const rfid = booking.rfid?.toLowerCase() || "";
    const trip = booking.trip?.toLowerCase() || "";
    return rfid.includes(term) || trip.includes(term);
  });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredBookings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Card className="flex justify-center ml-10 w-full p-6 shadown-lg overflow-x-auto">
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold">Bookings</h2>
        </div>

        <Input
          className="max-w-xs mb-4"
          placeholder="Search by RFID or Trip"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset page when searching
          }}
        />

        <Table>
          <TableCaption>A list of bookings</TableCaption>
          <TableHeader>
            <TableRow className="font-bold text-md text-black">
              <TableHead>ID</TableHead>
              <TableHead>RFID</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Return</TableHead>
              <TableHead>Trip</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Passenger</TableHead>
              <TableHead>Settled Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-1">
            {currentData.map((booking) => (
              <TableRow className="font-semibold text-md text-black">
                <TableCell>{booking.booking_id}</TableCell>
                <TableCell>{booking.rfid}</TableCell>
                <TableCell>{booking.origin}</TableCell>
                <TableCell>{booking.destination}</TableCell>
                <TableCell>{booking.departure}</TableCell>
                <TableCell>{booking.return_date}</TableCell>
                <TableCell>{booking.trip}</TableCell>
                <TableCell>{booking.seat_class}</TableCell>
                <TableCell>{booking.passenger}</TableCell>
                <TableCell>
                  {booking.seat_class.toLowerCase() === "business"
                    ? "Hidden"
                    : booking.settled}
                </TableCell>
              </TableRow>
            ))}
            {currentData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className="cursor-pointer"
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem className="px-3 py-1 text-sm font-medium">
                Page {currentPage} of {totalPages || 1}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className="cursor-pointer"
                  aria-disabled={currentPage === totalPages || totalPages === 0}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingList;
