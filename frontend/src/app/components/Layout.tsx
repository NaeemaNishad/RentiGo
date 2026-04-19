import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Car, Calendar, User, Info, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Read user from session
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Car },
    { path: '/my-bookings', label: 'My Bookings', icon: Calendar },
    { path: '/about', label: 'About Us', icon: Info },
  ];

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-[#0D1F22] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">RentiGo</h1>
          <p className="text-sm text-white/70 mt-1">Rent your ride</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-[#135E35] text-white' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome, {user?.name || "Guest"}!
              </h2>
              <p className="text-sm text-gray-500">Customer ID: {user?.customer_id || "N/A"}</p>
            </div>
            <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.phone || ""}</p>
              </div>
              <Avatar className="h-10 w-10 bg-[#135E35]">
                <AvatarFallback className="bg-[#135E35] text-white">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}