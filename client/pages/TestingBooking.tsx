import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CustomerOnly } from "@/components/RoleGuard";
import { useUserStorage, STORAGE_KEYS, saveUserBooking } from "@/utils/userStorage";
import { useAuth } from "@/contexts/AuthContext";
import {
  Stethoscope,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const locations = [
  {
    id: 1,
    name: "HealthCare+ Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "028 3822 1234",
  },
  {
    id: 2,
    name: "HealthCare+ Quận 3",
    address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    phone: "028 3930 5678",
  },
  {
    id: 3,
    name: "HealthCare+ Thủ Đức",
    address: "789 Võ Nguyên Giáp, Thủ Đức, TP.HCM",
    phone: "028 3715 9012",
  },
];

export default function TestingBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { save } = useUserStorage();

  const [packageInfo, setPackageInfo] = useState({
    name: "",
    price: "",
  });

  const [formData, setFormData] = useState({
    location: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đặt lịch xét nghiệm",
      });
      navigate("/login");
      return;
    }

    const packageName = searchParams.get("name") || "";
    const packagePrice = searchParams.get("price") || "";

    setPackageInfo({
      name: decodeURIComponent(packageName),
      price: packagePrice,
    });
  }, [searchParams, isAuthenticated, isLoading, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.location) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    const bookingId = `STI${Date.now().toString().slice(-6)}`;
    const selectedLocationData = locations.find(
      (loc) => loc.id.toString() === formData.location,
    );

    // Save booking to user-specific storage
    try {
      const userEmail = user?.email;
      if (userEmail) {
        const newBooking = {
          id: bookingId,
          type: "testing",
          title: packageInfo.name,
          date: formData.date,
          time: formData.time,
          location: selectedLocationData?.name,
          status: "pending",
          price: packageInfo.price.toString(),
          details: {
            fullName: user?.name,
            email: user?.email,
            phone: user?.phone,
            service: packageInfo.name,
            notes: formData.notes,
            selectedLocation: selectedLocationData,
          },
          createdAt: new Date().toISOString(),
        };

        saveUserBooking(userEmail, newBooking);
      }
    } catch (error) {
      console.error('Error saving booking:', error);
    }

    // Simulate booking
    toast({
      title: "Đặt lịch thành công!",
      description: "Chúng tôi sẽ liên hệ xác nhận trong 24h",
    });

    // Navigate to success page with user info
    navigate("/services/testing/success", {
      state: {
        packageInfo,
        formData: {
          ...formData,
          fullName: user?.name,
          email: user?.email,
          phone: user?.phone,
        },
        userInfo: user,
        bookingId,
      },
    });
  };

  const selectedLocation = locations.find(
    (loc) => loc.id.toString() === formData.location,
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

  return (
    <CustomerOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <Stethoscope className="mx-auto h-16 w-16 text-medical-500" />
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Đặt lịch xét nghiệm STIs
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Hoàn tất thông tin để đặt lịch xét nghiệm
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt lịch</CardTitle>
                <CardDescription>
                  Vui lòng điền đầy đủ thông tin để hoàn tất đặt lịch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Information Display */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin cá nhân
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Họ và tên</p>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Số điện thoại</p>
                          <p className="font-medium">{user?.phone}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Thông tin này được lấy từ tài khoản đã đăng ký của bạn
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin lịch hẹn
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">
                          Địa điểm <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.location}
                          onValueChange={(value) =>
                            setFormData({ ...formData, location: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn địa điểm" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem
                                key={location.id}
                                value={location.id.toString()}
                              >
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">
                          Ngày khám <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label>
                          Giờ khám <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={
                                formData.time === time ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setFormData({ ...formData, time })}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú thêm</Label>
                    <Textarea
                      id="notes"
                      placeholder="Có triệu chứng gì đặc biệt hoặc yêu cầu khác..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Xác nhận đặt lịch
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt lịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Gói xét nghiệm</h4>
                  <p className="text-lg font-semibold text-medical-600">
                    {packageInfo.name}
                  </p>
                  <p className="text-2xl font-bold text-medical-600">
                    {packageInfo.price
                      ? `${parseInt(packageInfo.price).toLocaleString()}đ`
                      : "Liên hệ"}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-medium">{user?.phone}</span>
                    </div>
                  </div>
                </div>

                {selectedLocation && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Địa điểm khám
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start">
                        <MapPin className="mr-2 h-4 w-4 mt-0.5 text-gray-400" />
                        <span>{selectedLocation.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{selectedLocation.phone}</span>
                      </div>
                    </div>
                  </div>
                )}

                {formData.date && formData.time && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thời gian khám
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(formData.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{formData.time}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Quy trình xét nghiệm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tư vấn trước xét nghiệm
                    </p>
                    <p className="text-xs text-gray-600">
                      15-20 phút tư vấn với bác sĩ
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Lấy mẫu xét nghiệm
                    </p>
                    <p className="text-xs text-gray-600">
                      Nhanh chóng, an toàn
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Nhận kết quả
                    </p>
                    <p className="text-xs text-gray-600">Qua app hoặc email</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </CustomerOnly>
  );
}
