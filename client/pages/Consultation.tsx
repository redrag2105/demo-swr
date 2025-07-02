import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Calendar,
  Video,
  Clock,
  User,
  Star,
  CheckCircle,
  Mail,
  Phone,
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const consultants = [
  {
    id: 1,
    name: "BS. Nguyễn Thị Hoa",
    specialty: "Chuyên khoa Sản phụ khoa",
    experience: "15 năm kinh nghiệm",
    rating: 4.9,
    reviews: 145,
    avatar: "NH",
    price: 500000,
    available: ["09:00", "10:30", "14:00", "15:30", "16:00"],
  },
  {
    id: 2,
    name: "BS. Trần Văn Minh",
    specialty: "Chuyên khoa Nam học",
    experience: "12 năm kinh nghiệm",
    rating: 4.8,
    reviews: 98,
    avatar: "TM",
    price: 450000,
    available: ["08:00", "09:30", "11:00", "14:30", "16:30"],
  },
  {
    id: 3,
    name: "BS. Lê Thị Mai",
    specialty: "Tư vấn sức khỏe sinh sản",
    experience: "10 năm kinh nghiệm",
    rating: 4.7,
    reviews: 87,
    avatar: "LM",
    price: 400000,
    available: ["10:00", "11:30", "13:00", "15:00", "17:00"],
  },
];

export default function Consultation() {
  const [selectedConsultant, setSelectedConsultant] = useState<number | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    reason: "",
    symptoms: "",
  });
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
        description: "Vui lòng đăng nhập để đặt lịch tư vấn",
      });
      navigate("/login");
      return;
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConsultant || !selectedDate || !selectedTime) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn bác sĩ, ngày và giờ tư vấn",
        variant: "destructive",
      });
      return;
    }

    const bookingId = `CON${Date.now().toString().slice(-6)}`;
    const selectedConsultantData = consultants.find((c) => c.id === selectedConsultant);

    // Save booking to localStorage
    try {
      const userEmail = user?.email;
      if (userEmail && selectedConsultantData) {
        const existingBookings = localStorage.getItem(`healthcare_bookings_${userEmail}`);
        const bookings = existingBookings ? JSON.parse(existingBookings) : [];
        
        const newBooking = {
          id: bookingId,
          type: "consultation",
          title: `Tư vấn với ${selectedConsultantData.name}`,
          date: selectedDate,
          time: selectedTime,
          status: "pending",
          price: selectedConsultantData.price.toString(),
          details: {
            consultant: selectedConsultantData.name,
            specialty: selectedConsultantData.specialty,
            reason: formData.reason,
            symptoms: formData.symptoms,
          },
          createdAt: new Date().toISOString(),
        };

        bookings.push(newBooking);
        localStorage.setItem(`healthcare_bookings_${userEmail}`, JSON.stringify(bookings));
      }
    } catch (error) {
      console.error('Error saving booking:', error);
    }

    // Simulate booking
    toast({
      title: "Đặt lịch thành công!",
      description: "Chúng tôi sẽ gửi thông tin chi tiết qua email",
    });

    // Navigate to success page with user info
    navigate("/consultation/success", {
      state: {
        consultant: selectedConsultantData,
        appointmentData: {
          date: selectedDate,
          time: selectedTime,
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

  const selectedConsultantData = consultants.find(
    (c) => c.id === selectedConsultant,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <MessageCircle className="mx-auto h-16 w-16 text-medical-500" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Đặt lịch tư vấn trực tuyến
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Kết nối với các chuyên gia để được tư vấn về sức khỏe sinh sản
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Consultant Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Chọn bác sĩ tư vấn</CardTitle>
                <CardDescription>
                  Lựa chọn chuyên gia phù hợp với nhu cầu của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {consultants.map((consultant) => (
                  <div
                    key={consultant.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      selectedConsultant === consultant.id
                        ? "border-medical-500 bg-medical-50"
                        : "border-gray-200 hover:border-medical-300"
                    }`}
                    onClick={() => setSelectedConsultant(consultant.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-100">
                          <span className="font-medium text-medical-700">
                            {consultant.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {consultant.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {consultant.specialty}
                          </p>
                          <p className="text-sm text-gray-500">
                            {consultant.experience}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-current text-yellow-400" />
                              <span className="ml-1 text-sm font-medium">
                                {consultant.rating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({consultant.reviews} đánh giá)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-medical-600">
                          {consultant.price.toLocaleString()}đ
                        </div>
                        <div className="text-sm text-gray-500">/ 60 phút</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Date and Time Selection */}
            {selectedConsultant && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Chọn ngày và giờ</CardTitle>
                  <CardDescription>
                    Lựa chọn thời gian phù hợp cho buổi tư vấn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày tư vấn</Label>
                      <Input
                        id="date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Giờ tư vấn</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedConsultantData?.available.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt lịch</CardTitle>
                <CardDescription>
                  Điền thông tin để hoàn tất đặt lịch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* User Information Display */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Thông tin cá nhân</h4>
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

                  <div className="space-y-2">
                    <Label htmlFor="reason">Lý do tư vấn</Label>
                    <Select
                      value={formData.reason}
                      onValueChange={(value) =>
                        setFormData({ ...formData, reason: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cycle">
                          Theo dõi chu kỳ sinh sản
                        </SelectItem>
                        <SelectItem value="contraception">
                          Tư vấn tránh thai
                        </SelectItem>
                        <SelectItem value="pregnancy">
                          Tư vấn mang thai
                        </SelectItem>
                        <SelectItem value="sti">Tư vấn STIs</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Triệu chứng hoặc câu hỏi</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Mô tả triệu chứng hoặc câu hỏi của bạn..."
                      value={formData.symptoms}
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
                    />
                  </div>

                  {selectedConsultant && selectedDate && selectedTime && (
                    <div className="rounded-lg bg-medical-50 p-4">
                      <h4 className="font-medium text-gray-900">
                        Thông tin đặt lịch
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Bác sĩ: {selectedConsultantData?.name}</p>
                        <p>Ngày: {selectedDate}</p>
                        <p>Giờ: {selectedTime}</p>
                        <p className="font-medium text-medical-600">
                          Phí tư vấn:{" "}
                          {selectedConsultantData?.price.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Đặt lịch tư vấn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
