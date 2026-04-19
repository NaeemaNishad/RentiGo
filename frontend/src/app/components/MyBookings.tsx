import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Car, Clock, IndianRupee, AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button"; // Assuming you have a UI button component

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const fetchBookings = () => {
    if (!user || !user.customer_id) return;
    fetch(`http://localhost:3000/api/bookings/${user.customer_id}`)
      .then((res) => res.json())
      .then((data) => setAllBookings(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Bookings fetch error:", err));
  };

  useEffect(() => {
    fetchBookings();
    fetch("http://localhost:3000/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Vehicles fetch error:", err));
  }, [user?.customer_id]);

  // Handle Cancellation
  const handleCancel = async (bookingId: string, vehicleId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_id: vehicleId })
      });

      if (response.ok) {
        alert("Booking cancelled successfully.");
        fetchBookings(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to cancel"}`);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Network error. Please try again.");
    }
  };

  const myBookings = useMemo(() => {
    if (!Array.isArray(allBookings)) return [];
    return allBookings.map((booking) => ({
      ...booking,
      vehicle: vehicles.find((v) => v.vehicle_id === booking.vehicle_id),
    }));
  }, [allBookings, vehicles]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">My Bookings</h1>
      <div className="grid gap-4">
        {myBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No bookings found for your account.</p>
          </div>
        ) : (
          myBookings.map((booking, index) => (
            <Card key={booking.booking_id || index} className={booking.status === 'Cancelled' ? 'opacity-70' : ''}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-black">
                  {booking.vehicle?.model || "Vehicle Information Unavailable"}
                </CardTitle>
                <Badge className={booking.status === 'Cancelled' ? "bg-red-500" : "bg-[#135E35]"}>
                  {booking.status || 'Confirmed'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 
                      {formatDate(booking.rental_date)} → {formatDate(booking.return_date)}
                    </div>
                    <div className="font-bold text-[#135E35] flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {booking.total_price || "0.00"}
                    </div>
                    <div className="text-xs text-gray-400">ID: {booking.booking_id}</div>
                  </div>

                  {/* Cancel Button - Only shows if not already cancelled */}
                  {booking.status !== 'Cancelled' && (
                    <Button 
                      variant="destructive"
                      onClick={() => handleCancel(booking.booking_id, booking.vehicle_id)}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}