import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  User,
  Mail,
  HelpCircle,
  CheckCircle,
  Clock,
  Star,
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

const questionCategories = [
  { value: "cycle", label: "Chu kỳ kinh nguyệt" },
  { value: "contraception", label: "Tránh thai" },
  { value: "pregnancy", label: "Mang thai" },
  { value: "sti", label: "Bệnh lây truyền qua đường tình dục" },
  { value: "nutrition", label: "Dinh dưỡng" },
  { value: "symptoms", label: "Triệu chứng bất thường" },
  { value: "other", label: "Khác" },
];

const recentQuestions = [
  {
    id: 1,
    question: "Chu kỳ kinh nguyệt của tôi không đều, có sao không?",
    category: "Chu kỳ kinh nguyệt",
    status: "answered",
    time: "2 giờ trước",
    consultant: "BS. Nguyễn Thị Hoa",
  },
  {
    id: 2,
    question: "Thuốc tránh thai khẩn cấp có tác dụng phụ gì?",
    category: "Tránh thai",
    status: "pending",
    time: "5 giờ trước",
  },
  {
    id: 3,
    question: "Xét nghiệm HIV cần bao lâu để có kết quả?",
    category: "STIs",
    status: "answered",
    time: "1 ngày trước",
    consultant: "BS. Trần Văn Minh",
  },
];

export default function QAPage() {
  const [formData, setFormData] = useState({
    age: "",
    category: "",
    question: "",
    isAnonymous: false,
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
        description: "Vui lòng đăng nhập để đặt câu hỏi",
      });
      navigate("/login");
      return;
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.category) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập câu hỏi và chọn danh mục",
        variant: "destructive",
      });
      return;
    }

    const questionId = `QA${Date.now().toString().slice(-6)}`;
    const categoryLabel = questionCategories.find(cat => cat.value === formData.category)?.label || formData.category;

    // Save question to localStorage
    try {
      const userEmail = user?.email;
      if (userEmail) {
        const existingBookings = localStorage.getItem(`healthcare_bookings_${userEmail}`);
        const bookings = existingBookings ? JSON.parse(existingBookings) : [];
        
        const newBooking = {
          id: questionId,
          type: "qa",
          title: `Câu hỏi về ${categoryLabel}`,
          status: "pending",
          details: {
            category: categoryLabel,
            question: formData.question,
            age: formData.age,
            isAnonymous: formData.isAnonymous,
          },
          createdAt: new Date().toISOString(),
        };

        bookings.push(newBooking);
        localStorage.setItem(`healthcare_bookings_${userEmail}`, JSON.stringify(bookings));
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }

    // Simulate sending question
    toast({
      title: "Gửi câu hỏi thành công!",
      description: "Chúng tôi sẽ phản hồi trong 24h",
    });

    // Navigate to success page with user info
    navigate("/qa/success", {
      state: {
        ...formData,
        name: user?.name,
        email: user?.email,
        userInfo: user,
        questionId,
      },
    });
  };

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
              Đặt câu hỏi cho chuyên gia
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Nhận lời tư vấn chuyên nghiệp từ đội ngũ bác sĩ có kinh nghiệm
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Question Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Đặt câu hỏi mới</CardTitle>
                <CardDescription>
                  Mô tả chi tiết câu hỏi để nhận được lời tư vấn chính xác nhất
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
                      <div className="text-xs text-gray-500 mt-2">
                        Thông tin này được lấy từ tài khoản đã đăng ký của bạn
                      </div>
                    </div>
                  </div>

                  {/* Privacy Option */}
                  <div className="rounded-lg bg-medical-50 p-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAnonymous: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        Gửi câu hỏi ẩn danh (không hiển thị thông tin cá nhân cho bác sĩ)
                      </Label>
                    </div>
                  </div>

                  {/* Age field */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Tuổi (tùy chọn)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="13"
                      max="100"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      placeholder="Nhập tuổi để được tư vấn chính xác hơn"
                    />
                  </div>

                  {/* Question Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Nội dung câu hỏi
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Danh mục <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục câu hỏi" />
                          </SelectTrigger>
                          <SelectContent>
                            {questionCategories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="question">
                          Câu hỏi của bạn{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="question"
                          placeholder="Mô tả chi tiết câu hỏi, triệu chứng hoặc tình huống của bạn..."
                          className="min-h-[120px]"
                          value={formData.question}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              question: e.target.value,
                            })
                          }
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Càng chi tiết thì câu trả lời sẽ càng chính xác
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Gửi câu hỏi
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Thông tin dịch vụ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-medical-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Thời gian phản h���i
                    </p>
                    <p className="text-sm text-gray-600">Trong vòng 24 giờ</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-medical-500" />
                  <div>
                    <p className="font-medium text-gray-900">Đội ngũ tư vấn</p>
                    <p className="text-sm text-gray-600">50+ chuyên gia</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-medical-500" />
                  <div>
                    <p className="font-medium text-gray-900">Chất lượng</p>
                    <p className="text-sm text-gray-600">4.9/5 sao đánh giá</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Miễn phí</strong> cho câu hỏi cơ bản. Tư vấn chuyên
                    sâu qua video call tính phí.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Câu hỏi gần đây</CardTitle>
                <CardDescription>
                  Tham khảo các câu hỏi đã được giải đáp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-lg border p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={
                          q.status === "answered" ? "default" : "secondary"
                        }
                      >
                        {q.status === "answered" ? "Đã trả lời" : "Đang chờ"}
                      </Badge>
                      <span className="text-xs text-gray-500">{q.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {q.question}
                    </p>
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-medium">{q.category}</span>
                      {q.consultant && (
                        <>
                          {" • "}
                          <span>Trả lời bởi {q.consultant}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
