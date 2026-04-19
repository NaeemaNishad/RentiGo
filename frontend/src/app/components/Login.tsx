import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Car, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function Login() {
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!customerId || !password) {
      setError("Please enter both Customer ID and Password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // ✅ Matches the backend controller variable name
          customer_id: customerId, 
          password: password
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Store user object in localStorage for the session
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect to dashboard/home
        navigate("/");
      } else {
        // Handle 401 Unauthorized or other error messages from backend
        setError(data.message || "Invalid Customer ID or Password");
      }

    } catch (err) {
      setError("Cannot connect to server. Please ensure backend is running.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1F22] to-[#135E35] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-[#0D1F22] flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to your RentCar account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                placeholder="e.g. cust_1"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#135E35] hover:bg-[#0D1F22]"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#135E35] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}