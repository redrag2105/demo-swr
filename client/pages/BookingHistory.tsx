import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Stethoscope,
  MessageCircle,
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingItem {
  id: string;
  type: "testing" | "consultation" | "qa";
  title: string;
  date: string;
  time?: string;
  location?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price?: string;
  details: any;
  createdAt: string;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để xem lịch sử đặt lịch",
      });
      navigate("/login");
      return;
    }

    // Load bookings from localStorage
    loadBookingHistory();
  }, [isAuthenticated, isLoading, navigate, toast]);

  const loadBookingHistory = () => {
    try {
      const userEmail = user?.email;
      if (!userEmail) return;

      const savedBookings = localStorage.getItem(`healthcare_bookings_${userEmail}`);
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings);
        setBookings(parsedBookings.sort((a: BookingItem, b: BookingItem) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading booking history:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>;
      case "confirmed":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Đã xác nhận</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "testing":
        return <Stethoscope className="h-5 w-5 text-medical-500" />;
      case "consultation":
        return <MessageCircle className="h-5 w-5 text-medical-500" />;
      case "qa":
        return <HelpCircle className="h-5 w-5 text-medical-500" />;
      default:
        return <Calendar className="h-5 w-5 text-medical-500" />;
    }
  };

  const getServiceName = (type: string) => {
    switch (type) {
      case "testing":
        return "Xét nghiệm STIs";
      case "consultation":
        return "Tư vấn trực tuyến";
      case "qa":
        return "Hỏi đáp chuyên gia";
      default:
        return "Dịch vụ";
    }
  };

  const renderBookingCard = (booking: BookingItem) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getServiceIcon(booking.type)}
            <div>
              <CardTitle className="text-lg">{booking.title}</CardTitle>
              <CardDescription>
                {getServiceName(booking.type)} • ID: {booking.id}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Date and Time */}
        {booking.date && (
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">
              {new Date(booking.date).toLocaleDateString("vi-VN")}
              {booking.time && ` lúc ${booking.time}`}
            </span>
          </div>
        )}

        {/* Location */}
        {booking.location && (
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{booking.location}</span>
          </div>
        )}

        {/* Price */}
        {booking.price && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-medical-600">
              Giá: {parseInt(booking.price).toLocaleString()}đ
            </span>
          </div>
        )}

        {/* Created date */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Đặt lịch lúc: {new Date(booking.createdAt).toLocaleString("vi-VN")}
        </div>

        {/* Additional details based on type */}
        {booking.type === "consultation" && booking.details.consultant && (
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <p className="text-sm font-medium">Bác sĩ: {booking.details.consultant}</p>
            {booking.details.reason && (
              <p className="text-sm text-gray-600">Lý do: {booking.details.reason}</p>
            )}
          </div>
        )}

        {booking.type === "qa" && booking.details.category && (
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <p className="text-sm font-medium">Danh mục: {booking.details.category}</p>
            {booking.details.question && (
              <p className="text-sm text-gray-600 line-clamp-2">
                Câu hỏi: {booking.details.question}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const testingBookings = bookings.filter(b => b.type === "testing");
  const consultationBookings = bookings.filter(b => b.type === "consultation");
  const qaBookings = bookings.filter(b => b.type === "qa");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar className="mx-auto h-16 w-16 text-medical-500" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Lịch sử đặt lịch
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Quản lý và theo dõi tất cả các dịch vụ bạn đã đặt
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <User className="h-10 w-10 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-600">{user?.phone}</p>
            </div>
          </CardContent>
        </Card>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có lịch đặt nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa đặt lịch dịch vụ nào. Hãy khám phá các dịch vụ của chúng tôi.
              </p>
              <Button onClick={() => navigate("/services")}>
                Xem dịch vụ
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                Tất cả ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="testing">
                Xét nghiệm ({testingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="consultation">
                Tư vấn ({consultationBookings.length})
              </TabsTrigger>
              <TabsTrigger value="qa">
                Hỏi đáp ({qaBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {bookings.map(renderBookingCard)}
            </TabsContent>

            <TabsContent value="testing" className="mt-6">
              {testingBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Stethoscope className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-600">Chưa có lịch xét nghiệm nào</p>
                  </CardContent>
                </Card>
              ) : (
                testingBookings.map(renderBookingCard)
              )}
            </TabsContent>

            <TabsContent value="consultation" className="mt-6">
              {consultationBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-600">Chưa có lịch tư vấn nào</p>
                  </CardContent>
                </Card>
              ) : (
                consultationBookings.map(renderBookingCard)
              )}
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              {qaBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <HelpCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-600">Chưa có câu hỏi nào</p>
                  </CardContent>
                </Card>
              ) : (
                qaBookings.map(renderBookingCard)
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
