// Mock data for vehicle rental system

export interface Vehicle {
  vehicle_id: number;
  model: string;
  type: string;
  fuel_type: string;
  seating_capacity: number;
  registration_no: string;
  price_per_day: number;
  availability: boolean;
  image?: string;
  brand?: string;
}

export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  license_no: string;
  password: string;
}

export interface Booking {
  booking_id: string;
  customer_id: string;
  vehicle_id: number;
  rental_date: string;
  return_date: string;
  total_price: number;
}

// Generate 5000 vehicle records
const vehicleTypes = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Van', 'Truck', 'Convertible'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const brands = ['Toyota', 'Honda', 'Hyundai', 'Maruti Suzuki', 'Mahindra', 'Tata', 'Ford', 'BMW', 'Mercedes', 'Audi'];
const models = {
  Toyota: ['Fortuner', 'Innova Crysta', 'Camry', 'Corolla'],
  Honda: ['City', 'Civic', 'Amaze', 'CR-V'],
  Hyundai: ['Creta', 'Verna', 'i20', 'Venue'],
  'Maruti Suzuki': ['Swift', 'Baleno', 'Vitara Brezza', 'Ertiga'],
  Mahindra: ['Scorpio', 'XUV700', 'Thar', 'Bolero'],
  Tata: ['Nexon', 'Harrier', 'Safari', 'Punch'],
  Ford: ['Ecosport', 'Endeavour', 'Figo', 'Aspire'],
  BMW: ['3 Series', '5 Series', 'X1', 'X5'],
  Mercedes: ['C-Class', 'E-Class', 'GLC', 'S-Class'],
  Audi: ['A4', 'A6', 'Q3', 'Q7']
};

function generateVehicles(): Vehicle[] {
  const vehicles: Vehicle[] = [];
  
  for (let i = 1; i <= 5000; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const modelList = models[brand as keyof typeof models];
    const model = modelList[Math.floor(Math.random() * modelList.length)];
    const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
    const seatingCapacity = type === 'Van' ? 7 : type === 'SUV' ? 7 : type === 'Sedan' ? 5 : 5;
    const basePrice = type === 'Luxury' ? 5000 : type === 'SUV' ? 2500 : type === 'Sedan' ? 1500 : 1000;
    const price = basePrice + Math.floor(Math.random() * 1000);
    
    vehicles.push({
      vehicle_id: i,
      model: `${brand} ${model}`,
      type,
      fuel_type: fuelType,
      seating_capacity: seatingCapacity,
      registration_no: `MH${Math.floor(Math.random() * 50).toString().padStart(2, '0')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}`,
      price_per_day: price,
      availability: Math.random() > 0.3,
      brand
    });
  }
  
  return vehicles;
}

export const vehicles = generateVehicles();

// Initialize from localStorage or use empty array
export function getCustomers(): Customer[] {
  const stored = localStorage.getItem('customers');
  return stored ? JSON.parse(stored) : [];
}

export function saveCustomer(customer: Customer): void {
  const customers = getCustomers();
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));
}

export function getBookings(): Booking[] {
  const stored = localStorage.getItem('bookings');
  return stored ? JSON.parse(stored) : [];
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

export function updateVehicleAvailability(vehicleId: number, availability: boolean): void {
  // In real app, this would update the database
  const vehicle = vehicles.find(v => v.vehicle_id === vehicleId);
  if (vehicle) {
    vehicle.availability = availability;
  }
}

export function getCurrentUser(): Customer | null {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : null;
}

export function setCurrentUser(customer: Customer | null): void {
  if (customer) {
    localStorage.setItem('currentUser', JSON.stringify(customer));
  } else {
    localStorage.removeItem('currentUser');
  }
}

export function customerExists(customerId: string): boolean {
  const customers = getCustomers();
  return customers.some(c => c.customer_id === customerId);
}

export function validateLogin(customerId: string, password: string): Customer | null {
  const customers = getCustomers();
  const customer = customers.find(c => c.customer_id === customerId && c.password === password);
  return customer || null;
}
