import { Link } from "react-router-dom";
import { ArrowRight, Shield, Heart, Users } from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-medical-50 to-medical-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Chăm sóc sức khỏe{" "}
              <span className="text-medical-600">sinh sản</span> toàn diện
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Cung cấp dịch vụ chăm sóc sức khỏe sinh sản chuyên nghiệp với đội
              ngũ bác sĩ và tư vấn viên giàu kinh nghiệm. Theo dõi chu kỳ sinh
              sản, tư vấn trực tuyến và xét nghiệm STIs an toàn, bảo mật.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/services" className="flex items-center">
                  Khám phá dịch vụ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/consultation">Tư vấn ngay</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto w-full max-w-lg">
              <img
                className="h-64 w-full rounded-xl object-cover shadow-xl sm:h-80"
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Medical consultation"
              />
              <div className="absolute -bottom-6 -right-6 rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-100">
                    <Shield className="h-6 w-6 text-medical-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      100% Bảo mật
                    </div>
                    <div className="text-sm text-gray-600">
                      Thông tin an toàn
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-medical-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-medical-500" />
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                10,000+
              </div>
              <div className="text-sm text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Heart className="h-8 w-8 text-medical-500" />
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">
                Tư vấn viên chuyên nghiệp
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="h-8 w-8 text-medical-500" />
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Hỗ trợ tư vấn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
