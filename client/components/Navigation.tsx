import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  Calendar,
  MessageCircle,
  FileText,
  Stethoscope,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/components/RoleGuard";
import { getRoleDisplayName, hasRole } from "@/utils/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navigation = [
  { name: "Trang chủ", href: "/", icon: Heart },
  { name: "Dịch vụ", href: "/services", icon: Stethoscope },
  { name: "Theo dõi chu kỳ", href: "/cycle-tracking", icon: Calendar },
  { name: "Tư vấn", href: "/consultation", icon: MessageCircle },
  { name: "Blog", href: "/blog", icon: FileText },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, userRole } = useRoles();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-medical-200 py-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-500">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-medical-800">
                  HealthCare+
                </div>
                <div className="text-xs text-medical-600">
                  Chăm sóc sức khỏe sinh sản
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center space-x-1 border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "border-medical-500 text-medical-600"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        {getRoleDisplayName(userRole)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  {hasRole(userRole, ['customer']) && (
                  <DropdownMenuItem asChild>
                    <Link to="/booking-history" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Lịch sử đặt lịch</span>
                    </Link>
                  </DropdownMenuItem>
                  )}
                  
                  {/* Role-specific dashboard links */}
                  {hasRole(userRole, ['doctor']) && (
                    <DropdownMenuItem asChild>
                      <Link to="/doctor-dashboard" className="flex items-center">
                        <Stethoscope className="mr-2 h-4 w-4" />
                        <span>Dashboard Bác sĩ</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {hasRole(userRole, ['consultant']) && (
                    <DropdownMenuItem asChild>
                      <Link to="/consultant-dashboard" className="flex items-center">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>Dashboard Tư vấn viên</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {/* Admin only links */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/storage-demo" className="flex items-center">
                          <span className="mr-2">🗂️</span>
                          <span>Storage Demo</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/user-management" className="flex items-center">
                          <span className="mr-2">👥</span>
                          <span>Quản lý User</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors",
                      location.pathname === item.href
                        ? "border-medical-500 bg-medical-50 text-medical-700"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col space-y-2 px-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      <div className="text-xs text-blue-600 font-medium">
                        {getRoleDisplayName(userRole)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      asChild
                      className="justify-start"
                    >
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Thông tin cá nhân
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      asChild
                      className="justify-start"
                    >
                      <Link to="/booking-history">
                        <Calendar className="mr-2 h-4 w-4" />
                        Lịch sử đặt lịch
                      </Link>
                    </Button>
                    
                    {/* Role-specific dashboard links */}
                    {hasRole(userRole, ['doctor']) && (
                      <Button 
                        variant="ghost" 
                        asChild
                        className="justify-start"
                      >
                        <Link to="/doctor-dashboard">
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Dashboard Bác sĩ
                        </Link>
                      </Button>
                    )}
                    
                    {hasRole(userRole, ['consultant']) && (
                      <Button 
                        variant="ghost" 
                        asChild
                        className="justify-start"
                      >
                        <Link to="/consultant-dashboard">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Dashboard Tư vấn viên
                        </Link>
                      </Button>
                    )}
                    
                    {/* Admin only links */}
                    {isAdmin && (
                      <>
                        <Button 
                          variant="ghost" 
                          asChild
                          className="justify-start"
                        >
                          <Link to="/storage-demo">
                            <span className="mr-2">🗂️</span>
                            Storage Demo
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          asChild
                          className="justify-start"
                        >
                          <Link to="/user-management">
                            <span className="mr-2">👥</span>
                            Quản lý User
                          </Link>
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link to="/login">Đăng nhập</Link>
                    </Button>
                    <Button asChild className="justify-start">
                      <Link to="/register">Đăng ký</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
