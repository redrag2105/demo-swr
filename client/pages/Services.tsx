import { useState } from "react";
import {
  Stethoscope,
  Calendar,
  MessageCircle,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const services = {
  testing: {
    title: "Xét nghiệm STIs",
    description:
      "Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục chuyên nghiệp",
    icon: Stethoscope,
    packages: [
      {
        name: "Gói cơ bản",
        price: "500.000đ",
        tests: ["HIV", "Giang mai", "Lậu"],
        duration: "24 giờ",
        features: [
          "Tư vấn trước xét nghiệm",
          "Kết quả qua email",
          "Hỗ trợ sau xét nghiệm",
        ],
      },
      {
        name: "Gói toàn diện",
        price: "1.200.000đ",
        tests: ["HIV", "Giang mai", "Lậu", "Herpes", "HPV", "Chlamydia"],
        duration: "48 giờ",
        features: [
          "Tư vấn chi tiết",
          "Kết quả qua app",
          "Tư vấn điều trị",
          "Theo dõi sức khỏe",
        ],
      },
      {
        name: "Gói cao cấp",
        price: "2.000.000đ",
        tests: ["Toàn bộ STIs panel", "Xét nghiệm gen", "Kháng sinh đồ"],
        duration: "72 giờ",
        features: [
          "Tư vấn 1-1 với BS",
          "Báo cáo chi tiết",
          "Kế hoạch điều trị",
          "Theo dõi 6 tháng",
        ],
      },
    ],
  },
  consultation: {
    title: "Tư vấn trực tuyến",
    description:
      "Kết nối với các chuyên gia để được tư vấn về sức khỏe sinh sản",
    icon: MessageCircle,
    packages: [
      {
        name: "Tư vấn cơ bản",
        price: "200.000đ",
        duration: "30 phút",
        features: [
          "Chat trực tiếp",
          "Tư vấn qua video",
          "Hỏi đáp cơ bản",
          "Ghi âm cuộc gọi",
        ],
      },
      {
        name: "Tư vấn chuyên sâu",
        price: "500.000đ",
        duration: "60 phút",
        features: [
          "Tư vấn với chuyên gia",
          "Phân tích chi tiết",
          "Kế hoạch chăm sóc",
          "Theo dõi 1 tháng",
        ],
      },
      {
        name: "Gói theo dõi",
        price: "1.500.000đ",
        duration: "3 tháng",
        features: [
          "Tư vấn không giới hạn",
          "Theo dõi sức khỏe",
          "Kế hoạch cá nhân hóa",
          "Hỗ trợ 24/7",
        ],
      },
    ],
  },
};

export default function Services() {
  const [selectedTab, setSelectedTab] = useState("testing");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Dịch vụ chăm sóc sức khỏe
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe sinh sản chuyên
              nghiệp và toàn diện
            </p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardHeader>
              <Stethoscope className="mx-auto h-12 w-12 text-medical-500" />
              <CardTitle>Xét nghiệm STIs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Xét nghiệm chính xác, nhanh chóng với công nghệ hiện đại
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="mx-auto h-12 w-12 text-medical-500" />
              <CardTitle>Tư vấn trực tuyến</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kết nối với chuyên gia 24/7 qua video call và chat
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="mx-auto h-12 w-12 text-medical-500" />
              <CardTitle>Theo dõi chu kỳ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Quản lý chu kỳ sinh sản một cách khoa học và chính xác
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="mx-auto h-12 w-12 text-medical-500" />
              <CardTitle>Giáo dục sức khỏe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kiến thức và hướng dẫn từ các chuyên gia y tế
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Details */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testing">Xét nghiệm STIs</TabsTrigger>
            <TabsTrigger value="consultation">Tư vấn trực tuyến</TabsTrigger>
          </TabsList>

          <TabsContent value="testing" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Xét nghiệm STIs
              </h2>
              <p className="mt-2 text-gray-600">
                Các gói xét nghiệm phù hợp với nhu cầu của bạn
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {services.testing.packages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`relative ${index === 1 ? "ring-2 ring-medical-500" : ""}`}
                >
                  {index === 1 && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-medical-500">
                      Phổ biến nhất
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-medical-600">
                      {pkg.price}
                    </div>
                    <CardDescription>
                      Kết quả trong {pkg.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Xét nghiệm bao gồm:
                      </h4>
                      <ul className="space-y-1">
                        {pkg.tests.map((test, testIndex) => (
                          <li
                            key={testIndex}
                            className="flex items-center text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {test}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Dịch vụ kèm theo:
                      </h4>
                      <ul className="space-y-1">
                        {pkg.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      variant={index === 1 ? "default" : "outline"}
                      onClick={() => {
                        // Navigate to booking with package info (only pass numeric price)
                        const numericPrice = pkg.price.replace(/[^\d]/g, ''); // Remove all non-digit characters
                        window.location.href = `/services/testing/book?package=${index}&name=${encodeURIComponent(pkg.name)}&price=${numericPrice}`;
                      }}
                    >
                      Đặt lịch xét nghiệm
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Tư vấn trực tuyến
              </h2>
              <p className="mt-2 text-gray-600">
                Kết nối với các chuyên gia để được tư vấn chuyên nghiệp
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {services.consultation.packages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`relative ${index === 1 ? "ring-2 ring-medical-500" : ""}`}
                >
                  {index === 1 && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-medical-500">
                      Được chọn nhiều
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-medical-600">
                      {pkg.price}
                    </div>
                    <CardDescription>{pkg.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Dịch vụ bao gồm:
                      </h4>
                      <ul className="space-y-1">
                        {pkg.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      variant={index === 1 ? "default" : "outline"}
                    >
                      Đặt lịch tư vấn
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features */}
      <div className="bg-medical-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Tại sao chọn HealthCare+?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-medical-100">
                <Clock className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Nhanh chóng
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Kết quả xét nghiệm trong 24-72 giờ
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-medical-100">
                <Shield className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Bảo mật
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Thông tin cá nhân được bảo vệ tuyệt đối
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-medical-100">
                <Users className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Chuyên nghiệp
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Đội ngũ bác sĩ giàu kinh nghiệm
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-medical-100">
                <CheckCircle className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Chính xác
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Công nghệ xét nghiệm hiện đại nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
