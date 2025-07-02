import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  MessageCircle,
  Stethoscope,
  BookOpen,
  Star,
  Quote,
} from "lucide-react";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Theo dõi chu kỳ sinh sản",
    description:
      "Quản lý và theo dõi chu kỳ kinh nguyệt một cách khoa học và chính xác.",
    icon: Calendar,
    href: "/cycle-tracking",
    features: [
      "Nhắc nhở thời gian rụng trứng",
      "Tính toán khả năng mang thai",
      "Theo dõi triệu chứng",
      "Lịch uống thuốc tránh thai",
    ],
  },
  {
    title: "Tư vấn trực tuyến",
    description:
      "Kết nối với các chuyên gia để được tư vấn về sức khỏe sinh sản.",
    icon: MessageCircle,
    href: "/consultation",
    features: [
      "Tư vấn 24/7 với chuyên gia",
      "Đặt lịch hẹn trực tuyến",
      "Chat riêng tư bảo mật",
      "Hỏi đáp miễn phí",
    ],
  },
  {
    title: "Xét nghiệm STIs",
    description:
      "Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục an toàn.",
    icon: Stethoscope,
    href: "/services/sti-testing",
    features: [
      "Xét nghiệm chính xác",
      "Kết quả nhanh chóng",
      "Tư vấn trước và sau xét nghiệm",
      "Hoàn toàn bảo mật",
    ],
    price: "Từ 500.000đ",
  },
  {
    title: "Blog giáo dục",
    description: "Kiến thức và kinh nghiệm về chăm sóc sức khỏe sinh sản.",
    icon: BookOpen,
    href: "/blog",
    features: [
      "Bài viết từ chuyên gia",
      "Cập nhật kiến thức mới",
      "Chia sẻ kinh nghiệm",
      "Hướng dẫn chăm sóc",
    ],
  },
];

const testimonials = [
  {
    content:
      "Dịch vụ rất chuyên nghiệp và tư vấn viên nhiệt tình. Tôi cảm thấy an tâm khi sử dụng ứng dụng.",
    author: "Nguyễn Thu H.",
    role: "Khách hàng",
  },
  {
    content:
      "Chức năng theo dõi chu kỳ rất hữu ích, giúp tôi hiểu rõ hơn về cơ thể mình.",
    author: "Trần Minh L.",
    role: "Khách hàng",
  },
  {
    content:
      "Xét nghiệm nhanh chóng, kết quả chính xác và đội ngũ y tế rất chuyên nghiệp.",
    author: "Lê Thị M.",
    role: "Khách hàng",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Dịch vụ chăm sóc toàn diện
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe sinh sản chuyên
              nghiệp
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="h-full">
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-medical-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Về HealthCare+
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                HealthCare+ là nền tảng chăm sóc sức khỏe sinh sản hàng đầu tại
                Việt Nam, cam kết cung cấp dịch vụ y tế chất lượng cao với sự
                bảo mật tuyệt đối.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-medical-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    Đội ngũ chuyên gia với hơn 10 năm kinh nghiệm
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-medical-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    Công nghệ hiện đại, bảo mật thông tin tuyệt đối
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-medical-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    Dịch vụ tư vấn 24/7 với chi phí hợp lý
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link to="/about" className="flex items-center">
                    Tìm hiểu thêm
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                className="h-96 w-full rounded-xl object-cover shadow-xl"
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Medical team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Khách hàng nói về chúng tôi
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Những chia sẻ chân thực từ khách hàng đã sử dụng dịch vụ
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-medical-200" />
                  <blockquote className="mt-4 text-gray-600">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-medical-100 flex items-center justify-center">
                        <span className="text-medical-600 font-medium">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-medical-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Bắt đầu chăm sóc sức khỏe của bạn ngay hôm nay
            </h2>
            <p className="mt-4 text-lg text-medical-100">
              Đăng ký tài khoản miễn phí và trải nghiệm các dịch vụ chăm sóc sức
              khỏe chuyên nghiệp
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Đăng ký miễn phí</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-medical-600"
                asChild
              >
                <Link to="/contact">Liên hệ tư vấn</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
