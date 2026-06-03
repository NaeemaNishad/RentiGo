const BASE_URL = "https://rentigo-backendnw.onrender.com/api";

// ---------- AUTH ----------
export async function loginCustomer(phone: string, password: string) {
  const res = await fetch(`${BASE_URL}/customers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  return res.json();
}

export async function registerCustomer(data: any) {
  const res = await fetch(`${BASE_URL}/customers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------- VEHICLES ----------
export async function getVehicles() {
  const res = await fetch(`${BASE_URL}/vehicles`);
  return res.json();
}

// ---------- BOOKINGS ----------
export async function getBookings(customer_id: string) {
  const res = await fetch(`${BASE_URL}/bookings/${customer_id}`);
  return res.json();
}

export async function createBooking(data: any) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}