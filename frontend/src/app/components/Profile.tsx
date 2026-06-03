import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User, Phone, CreditCard, Calendar, IndianRupee } from "lucide-react";
import { Badge } from "./ui/badge";

export function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    if (user?.customer_id) {
      fetch(`https://rentigo-backendnw.onrender.com/api/bookings/${user.customer_id}`)
        .then(res => res.json())
        .then(data => setUserBookings(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user) return null;

  const totalSpent = userBookings.reduce((sum, b) => sum + b.total_price, 0);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 bg-[#0D1F22]">
              <AvatarFallback className="bg-[#0D1F22] text-white text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-gray-500 mt-1">Customer ID: {user.customer_id}</p>
              <Badge className="mt-2 bg-green-500">Active Account</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#135E35]/10 flex items-center justify-center rounded-full">
                  <User className="h-5 w-5 text-[#135E35]" />
                </div>
                <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{user.name}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#135E35]/10 flex items-center justify-center rounded-full">
                  <Phone className="h-5 w-5 text-[#135E35]" />
                </div>
                <div><p className="text-sm text-gray-500">Phone Number</p><p className="font-medium">{user.phone}</p></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#135E35]/10 flex items-center justify-center rounded-full">
                  <CreditCard className="h-5 w-5 text-[#135E35]" />
                </div>
                <div><p className="text-sm text-gray-500">License Number</p><p className="font-medium">{user.license_no}</p></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#0D1F22]/10 flex items-center justify-center"><Calendar className="h-6 w-6 text-[#0D1F22]" /></div>
              <div><p className="text-sm text-gray-500">Total Bookings</p><p className="text-2xl font-bold">{userBookings.length}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#135E35]/10 flex items-center justify-center"><IndianRupee className="h-6 w-6 text-[#135E35]" /></div>
              <div><p className="text-sm text-gray-500">Total Spent</p><p className="text-2xl font-bold text-[#135E35]">₹{totalSpent.toLocaleString()}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Account Security</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div><p className="font-medium">Password</p><p className="text-sm text-gray-500">Last changed recently</p></div>
              <Badge variant="outline">Secured</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-gray-500">Add an extra layer of security</p></div>
              <Badge variant="outline">Not Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}