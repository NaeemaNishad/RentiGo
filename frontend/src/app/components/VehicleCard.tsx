import { useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Car, Fuel, Users } from "lucide-react";
import { BookingDialog } from "./BookingDialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Vehicle {
  vehicle_id: string;
  model: string;
  registration_no: string;
  type: string;
  fuel_type: string;
  seating_capacity: number;
  price_per_day: number;
  availability?: number | boolean;
  availability_status: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

// 1. Updated Mapping: Link specific models to high-quality images
const vehicleImageMap: Record<string, string> = {
  // BIKES
  "Bajaj Pulsar 150": "https://blog.gaadikey.com/wp-content/uploads/2025/12/2026-Bajaj-Pulsar-150-Started-Arriving-at-Bajaj-Dealers.jpg",
  "Royal Enfield Classic 350": "https://images.carandbike.com/cms/articles/2024/11/3215276/Royal_Enfield_Goan_Classic_350_Image_11_33cadf2bf7.jpg",
  "Yamaha R15": "https://cdn-s3.autocarindia.com/Yamaha/YZF-R15-V4/500_8543.JPG",
  "TVS Jupiter": "https://www.rushlane.com/wp-content/uploads/2022/09/2022-tvs-jupiter-classic-launch-price-new-1.jpg",
  "Honda Activa": "https://images.carandbike.com/cms/articles/2023/3/3206384/2023_Honda_Activa125_Mid_Night_Blue_Metallic_aaaa1e475c.jpg",

  // CARS & SUVs
  "Mahindra Scorpio": "https://www.theindianwire.com/wp-content/uploads/2024/02/Mahindra-Scorpio-N-Z8-Select-Launched.jpg",
  "Kia Seltos": "https://images.carexpert.com.au/resize/3000/-/app/uploads/2022/11/Kia-Seltos-GT-Line_HERO-16x9-1.jpg",
  "Hyundai i20": "https://tse3.mm.bing.net/th/id/OIP.CfSGPse5JH72v2biVanL7QHaEK?pid=Api&P=0&h=220",
  "Suzuki Baleno": "https://tse1.mm.bing.net/th/id/OIP.QaTLPU9zgVVs0o3N_Pt6fwHaE8?pid=Api&P=0&h=220",
  "Honda City": "https://tse3.mm.bing.net/th/id/OIP.HqpPdFJcKQ7N8wibb_p7_QHaEu?pid=Api&P=0&h=220",
  "Hyundai Creta": "https://tse2.mm.bing.net/th/id/OIP.p5nRkOJtx4il7apeDZN-qQHaFj?pid=Api&P=0&h=220",
  "Toyota Innova": "https://cdn.antaranews.com/cache/1200x800/2023/01/29/452AC83B-F471-4010-8FDF-4755572C21F1.png",
  "Tata Nexon": "https://imgd.aeplcdn.com/642x361/n/cw/ec/195601/nexon-exterior-left-front-three-quarter.jpeg?isig=0&wm=1&q=80",
  "Toyota Fortuner": "https://imgcdn.oto.com/large/gallery/exterior/38/894/toyota-fortuner-front-angle-low-view-580768.jpg",
  "Maruti Swift": "https://img.autocarindia.com/mmv_images/colors/20251016103232_Maruti_Suzuki_Swift_Bluish_Black.jpg",

  // Defaults by Type (if model is not found)
  "Bike": "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg",
  "Car": "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg",
  "SUV": "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg",
  "Default": "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  // Improved availability check to handle MySQL 1/0 and string status
  const isAvailable = 
    vehicle.availability_status === 'Available' || 
    Number(vehicle.availability) === 1 || 
    vehicle.availability === true;

  // 2. Updated Image Logic: Search by Model -> Search by Type -> Use Default
  const displayImage = 
    vehicleImageMap[vehicle.model] || 
    vehicleImageMap[vehicle.type] || 
    vehicleImageMap['Default'];

  return (
    <>
      <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback 
            src={displayImage}
            alt={vehicle.model}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <Badge className={isAvailable ? "bg-green-500" : "bg-red-500"}>
              {isAvailable ? "Available" : "Booked"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-[#0D1F22]">{vehicle.model}</h3>
            <p className="text-sm text-gray-500">{vehicle.registration_no} • {vehicle.fuel_type}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1 font-normal border-gray-200">
              <Car className="w-3 h-3 text-gray-400" />
              {vehicle.type}
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal border-gray-200">
              <Users className="w-3 h-3 text-gray-400" />
              {vehicle.seating_capacity} Seats
            </Badge>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#135E35]">
                ₹{vehicle.price_per_day.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">/day</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-[#135E35] hover:bg-[#0D1F22] transition-colors"
            onClick={() => setBookingDialogOpen(true)}
            disabled={!isAvailable}
          >
            {isAvailable ? "Book Now" : "Unavailable"}
          </Button>
        </CardFooter>
      </Card>

      <BookingDialog
        vehicle={vehicle}
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
      />
    </>
  );
}