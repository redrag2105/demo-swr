import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Mail,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TestingSuccess() {
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600">Không tìm thấy thông tin đặt lịch.</p>
            <Button asChild className="mt-4">
              <Link to="/services">Về trang dịch vụ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { packageInfo, formData, bookingId } = bookingData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Đặt lịch xét nghiệm thành công!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5" />
              Thông tin lịch xét nghiệm
            </CardTitle>
            <CardDescription>Mã đặt lịch: #{bookingId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Gói xét nghiệm
                  </h3>
                  <p className="text-gray-600">{packageInfo.name}</p>
                  <p className="text-lg font-bold text-medical-600">
                    {packageInfo.price
                      ? `${parseInt(packageInfo.price).toLocaleString()}đ`
                      : "Liên hệ"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Thông tin bệnh nhân
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Họ tên: {formData.fullName}</p>
                    <div className="flex items-center">
                      <Phone className="mr-1 h-3 w-3" />
                      {formData.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {formData.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Thời gian & địa điểm
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(formData.date).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {formData.time}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                      <span>
                        {formData.location === "1" && "HealthCare+ Quận 1"}
                        {formData.location === "2" && "HealthCare+ Quận 3"}
                        {formData.location === "3" && "HealthCare+ Thủ Đức"}
                      </span>
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Ghi chú</h3>
                    <p className="text-sm text-gray-600">{formData.notes}</p>
                  </div>
                )}
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
                  <p className="font-medium text-gray-900">Xác nhận lịch hẹn</p>
                  <p className="text-sm text-gray-600">
                    Chúng tôi sẽ gọi điện xác nhận trong vòng 2-4 giờ
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Chuẩn bị trước khi đến
                  </p>
                  <p className="text-sm text-gray-600">
                    Mang theo CCCD và uống đủ nước (nếu cần xét nghiệm nước
                    tiểu)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-100 text-xs font-medium text-medical-600">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nhận kết quả</p>
                  <p className="text-sm text-gray-600">
                    Kết quả sẽ có trong 24-72 giờ qua email hoặc app
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Lưu ý quan trọng</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700">
            <ul className="space-y-2 text-sm">
              <li>• Vui lòng đến đúng giờ đã đặt để tránh chờ đợi</li>
              <li>• Nếu cần hủy hoặc đổi lịch, vui lòng liên hệ trước 4 giờ</li>
              <li>• Mang theo giấy tờ tùy thân để làm thủ tục</li>
              <li>• Kết quả xét nghiệm hoàn toàn bảo mật</li>
            </ul>
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
            <Link to="/services">Đặt xét nghiệm khác</Link>
          </Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Liên hệ: 1900-xxxx
          </Button>
        </div>
      </div>
    </div>
  );
}
