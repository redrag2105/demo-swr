import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, LogOut } from "lucide-react";
import { getSampleAccount } from "@/utils/auth";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const sampleAccount = getSampleAccount();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin cá nhân</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* User Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  {user.role === 'patient' ? 'Bệnh nhân' : 'Người dùng'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-medical-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-medical-500" />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-medical-500" />
                  <div>
                    <p className="text-sm text-gray-600">Thời gian đăng nhập</p>
                    <p className="font-medium">{formatDate(user.loginTime)}</p>
                  </div>
                </div>
              </div>

              {/* Extended Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                
                {sampleAccount.profile && (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Tuổi</p>
                      <p className="font-medium">{sampleAccount.profile.age} tuổi</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Giới tính</p>
                      <p className="font-medium">{sampleAccount.profile.gender}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                      <p className="font-medium">{sampleAccount.profile.address}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Liên hệ khẩn cấp</p>
                      <p className="font-medium">{sampleAccount.profile.emergencyContact}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin phiên đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Session ID:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{user.sessionId}</code>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge variant="default" className="bg-green-500">Hoạt động</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Loại lưu trữ:</span>
                <span className="text-sm">
                  {localStorage.getItem('healthcare_remember') ? 'LocalStorage (Ghi nhớ)' : 'SessionStorage'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button 
                variant="destructive" 
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
