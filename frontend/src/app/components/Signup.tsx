import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    license_no: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // ✅ The full, correct URL including the /customers/ prefix
    const response = await fetch("http://localhost:3000/api/customers/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        license_no: formData.license_no,
        password: formData.password
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess("Account created successfully!");
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(data.message || "Signup failed");
    }
  } catch (err) {
    setError("Cannot connect to server. Ensure backend is running on port 3000.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1F22] to-[#135E35] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Enter your details to register</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-4 w-4" /><AlertDescription>{success}</AlertDescription></Alert>}
            
            <div className="space-y-2"><Label>Full Name</Label><Input name="name" placeholder="John Doe" onChange={handleChange} required /></div>
            <div className="space-y-2"><Label>Phone</Label><Input name="phone" placeholder="Enter phone number" onChange={handleChange} required /></div>
            <div className="space-y-2"><Label>License</Label><Input name="license_no" placeholder="Enter license number" onChange={handleChange} required /></div>
            <div className="space-y-2"><Label>Password</Label><Input name="password" type="password" placeholder="Min 6 characters" onChange={handleChange} required /></div>
            <div className="space-y-2"><Label>Confirm Password</Label><Input name="confirmPassword" type="password" placeholder="Re-enter password" onChange={handleChange} required /></div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-[#135E35] hover:bg-[#0D1F22]" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</Button>
            <p className="text-sm text-center text-gray-600">Already have an account? <Link to="/login" className="text-[#135E35] font-medium hover:underline">Login</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}