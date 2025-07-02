import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle,
  MessageCircle,
  Clock,
  Bell,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function QASuccess() {
  const location = useLocation();
  const questionData = location.state;

  if (!questionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600">Không tìm thấy thông tin câu hỏi.</p>
            <Button asChild className="mt-4">
              <Link to="/qa">Đặt câu hỏi mới</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryLabels = {
    cycle: "Chu kỳ kinh nguyệt",
    contraception: "Tránh thai",
    pregnancy: "Mang thai",
    sti: "Bệnh lây truyền qua đường tình dục",
    nutrition: "Dinh dưỡng",
    symptoms: "Triệu chứng bất thường",
    other: "Khác",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Gửi câu hỏi thành công!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Cảm ơn bạn đã tin tưởng dịch vụ tư vấn của chúng tôi
          </p>
        </div>

        {/* Question Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Thông tin câu hỏi
            </CardTitle>
            <CardDescription>
              Mã câu hỏi: #{questionData.questionId}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Danh mục</h3>
              <span className="inline-flex items-center rounded-full bg-medical-100 px-3 py-1 text-sm font-medium text-medical-800">
                {categoryLabels[questionData.category] || questionData.category}
              </span>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Nội dung câu hỏi
              </h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {questionData.question}
                </p>
              </div>
            </div>

            {!questionData.isAnonymous && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {questionData.name}
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {questionData.email}
                    </div>
                    {questionData.age && <p>Tuổi: {questionData.age}</p>}
                  </div>
                </div>
              </div>
            )}

            {questionData.isAnonymous && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-800">
                    Câu hỏi ẩn danh
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Câu trả l���i sẽ được hiển thị công khai mà không có thông tin
                  cá nhân
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Quy trình xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-600">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-900">Đã nhận câu hỏi</p>
                  <p className="text-sm text-gray-600">
                    Câu hỏi đã được ghi nhận và chuyển tới bộ phận chuyên môn
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Phân tích và nghiên cứu
                  </p>
                  <p className="text-sm text-gray-600">
                    Chuyên gia sẽ xem xét và nghiên cứu câu hỏi của bạn
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nhận câu trả lời</p>
                  <p className="text-sm text-gray-600">
                    Câu trả lời sẽ được gửi trong vòng 24 giờ
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Cách nhận câu trả lời
            </CardTitle>
          </CardHeader>
          <CardContent>
            {questionData.isAnonymous ? (
              <div className="text-center py-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-blue-800 font-medium mb-2">
                    Câu trả lời sẽ được đăng công khai
                  </p>
                  <p className="text-sm text-blue-700">
                    Do bạn chọn gửi ẩn danh, câu trả lời sẽ xuất hiện trong phần
                    "Câu hỏi thường gặp" trên website để mọi người tham khảo.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-medical-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Qua email</p>
                    <p className="text-sm text-gray-600">
                      Câu trả lời sẽ được gửi tới: {questionData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 text-medical-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Thông báo app</p>
                    <p className="text-sm text-gray-600">
                      Bạn sẽ nhận thông báo push khi có câu trả lời
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/booking-history">Xem lịch sử câu hỏi</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/qa">Đặt câu hỏi khác</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/consultation">Tư vấn qua video</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
