import { Card, CardContent } from "./ui/card";
import { Car, Users, Shield, Clock, Award, MapPin } from "lucide-react";

export function AboutUs() {
  const features = [
    {
      icon: Car,
      title: "5000+ Vehicles",
      description: "Wide range of vehicles from economy to luxury cars, SUVs, and more"
    },
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Join thousands of satisfied customers who trust us for their rental needs"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All vehicles are regularly maintained and fully insured for your safety"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for any queries or assistance"
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive pricing with transparent billing and no hidden charges"
    },
    {
      icon: MapPin,
      title: "Pan India Service",
      description: "Available across major cities and locations throughout India"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">About RentiGo</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted partner for vehicle rentals across India. We make renting vehicles simple, affordable, and convenient.
        </p>
      </div>

      {/* Story Section */}
      <Card className="bg-gradient-to-r from-[#0D1F22] to-[#135E35] text-white">
        <CardContent className="p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-lg text-white/90 leading-relaxed mb-4">
            Founded in 2020, RentiGo has grown to become one of India's leading vehicle rental platforms. 
            We started with a simple vision: to make vehicle rentals accessible, transparent, and hassle-free for everyone.
          </p>
          <p className="text-lg text-white/90 leading-relaxed">
            Today, we serve thousands of customers across the country, offering a diverse fleet of over 5000 vehicles 
            ranging from compact hatchbacks to luxury sedans and spacious SUVs. Our commitment to quality service and 
            customer satisfaction has made us the preferred choice for both business and leisure travelers.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-[#135E35]/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#135E35]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-[#0D1F22]">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To provide reliable, affordable, and high-quality vehicle rental services that empower our customers 
              with the freedom to travel on their own terms. We strive to make every journey comfortable, safe, and memorable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-[#135E35]">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become India's most trusted and innovative vehicle rental platform, setting new standards in customer 
              service, technology integration, and sustainable mobility solutions for the future.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <Card className="bg-gray-50">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[#0D1F22] mb-2">5000+</div>
              <div className="text-gray-600">Vehicles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#135E35] mb-2">50+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0D1F22] mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#135E35] mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
          <p className="text-gray-600 mb-6">
            Have questions? We're here to help! Contact us anytime for assistance with your bookings or queries.
          </p>
          <div className="space-y-2">
            <p className="text-lg"><span className="font-semibold">Email:</span> support@rentiGo.com</p>
            <p className="text-lg"><span className="font-semibold">Phone:</span> +91 1800-123-4567</p>
            <p className="text-lg"><span className="font-semibold">Address:</span> Delhi, New Delhi, India</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}