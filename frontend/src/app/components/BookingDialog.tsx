import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

export function BookingDialog({ vehicle, open, onOpenChange }: any) {
  const [rentalDate, setRentalDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const totalPrice = vehicle.price_per_day * numberOfDays;

  const calculateReturnDate = (startDate: string, days: number): string => {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleBooking = async () => {
    if (!user || !user.customer_id) {
      toast.error("Please login to book a vehicle");
      return;
    }
    if (!rentalDate) return toast.error("Please select a date");

    setLoading(true);
    const returnDate = calculateReturnDate(rentalDate, numberOfDays);

    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user.customer_id,
          vehicle_id: vehicle.vehicle_id,
          rental_date: rentalDate,
          return_date: returnDate,
          total_price: totalPrice,
        }),
      });

      if (response.ok) {
        toast.success(`Confirmed! ${vehicle.model} is yours.`);
        onOpenChange(false);
        // Optional: Trigger a refresh so it shows in "My Bookings" immediately
        window.location.href = "/my-bookings";
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Booking failed.");
      }
    } catch (err) {
      toast.error("Connection error to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#0D1F22]">Book {vehicle.model}</DialogTitle>
          <DialogDescription>Enter your rental details below</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-black">Rental Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={rentalDate}
                onChange={(e) => setRentalDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 text-black focus-visible:ring-[#135E35]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-black">Number of Days</Label>
            <Input
              type="number"
              min="1"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(parseInt(e.target.value) || 1)}
              className="text-black focus-visible:ring-[#135E35]"
            />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Return Date</span>
              <span className="font-medium text-black">{rentalDate ? calculateReturnDate(rentalDate, numberOfDays) : "—"}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 text-black">
              <span>Total Price</span>
              <span className="text-[#135E35]">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="text-black" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleBooking} 
            className="bg-[#135E35] hover:bg-[#0D1F22] text-white"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}