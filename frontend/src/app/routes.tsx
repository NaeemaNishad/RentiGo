import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Home } from "./components/Home";
import { MyBookings } from "./components/MyBookings";
import { Profile } from "./components/Profile";
import { AboutUs } from "./components/AboutUs";


// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirect to home if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("user");

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "my-bookings",
        element: <MyBookings />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
    ],
  },
]);
