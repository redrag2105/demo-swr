import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  User,
  Clock,
  Video,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConsultationSuccess() {
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600">Không tìm thấy thông tin đặt lịch.</p>
            <Button asChild className="mt-4">
              <Link to="/consultation">Đặt lịch mới</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Đặt lịch thành công!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Thông tin lịch hẹn
            </CardTitle>
            <CardDescription>
              Mã đặt lịch: #HC{Date.now().toString().slice(-6)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Bác sĩ tư vấn</p>
                    <p className="text-gray-600">
                      {bookingData.consultant.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {bookingData.consultant.specialty}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Ngày tư vấn</p>
                    <p className="text-gray-600">{bookingData.date}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Thời gian</p>
                    <p className="text-gray-600">{bookingData.time}</p>
                    <p className="text-sm text-gray-500">Thời lượng: 60 phút</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Thông tin bệnh nhân
                    </p>
                    <p className="text-gray-600">{bookingData.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{bookingData.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Số điện thoại</p>
                    <p className="text-gray-600">{bookingData.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {bookingData.reason && (
              <div className="pt-4 border-t border-gray-200">
                <p className="font-medium text-gray-900 mb-2">Lý do tư vấn</p>
                <p className="text-gray-600">{bookingData.reason}</p>
              </div>
            )}

            {bookingData.symptoms && (
              <div className="pt-4 border-t border-gray-200">
                <p className="font-medium text-gray-900 mb-2">
                  Triệu chứng/Câu hỏi
                </p>
                <p className="text-gray-600">{bookingData.symptoms}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">
                  Tổng chi phí
                </span>
                <span className="text-2xl font-bold text-medical-600">
                  {bookingData.consultant.price.toLocaleString()}đ
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Các bước tiếp theo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Kiểm tra email xác nhận
                  </p>
                  <p className="text-sm text-gray-600">
                    Chúng tôi đã gửi email xác nhận và hướng dẫn tham gia cuộc
                    họp
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Chuẩn bị cho buổi tư vấn
                  </p>
                  <p className="text-sm text-gray-600">
                    Chuẩn bị các câu hỏi và tài liệu y tế liên quan (nếu có)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Tham gia cuộc họp đúng giờ
                  </p>
                  <p className="text-sm text-gray-600">
                    Click vào link trong email 5-10 phút trước giờ hẹn
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/booking-history">Xem lịch sử đặt lịch</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/consultation">Đặt lịch khác</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
